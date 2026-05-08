from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import math
import uuid

# ✅ MongoDB
from pymongo import MongoClient

# 🔥 CONNECTION (keep your real password here)
db_password = "admin123"

client = MongoClient(
    f"mongodb+srv://admin:{db_password}@cluster0.tv7euil.mongodb.net/?retryWrites=true&w=majority"
)

db = client["delivery_app"]
orders_collection = db["orders"]

# OR-Tools
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= MODELS =================
class Location(BaseModel):
    lat: float
    lng: float

class RequestData(BaseModel):
    locations: List[Location]

class Order(BaseModel):
    lat: float
    lng: float

# ================= DRIVERS =================
drivers_db = [
    {"id": "driver1", "lat": 28.61, "lng": 77.23},
    {"id": "driver2", "lat": 28.62, "lng": 77.24}
]

# ================= HELPERS =================
def distance(a, b):
    return math.sqrt((a["lat"] - b["lat"])**2 + (a["lng"] - b["lng"])**2)

def create_distance_matrix(locations):
    return [
        [distance(locations[i], locations[j]) for j in range(len(locations))]
        for i in range(len(locations))
    ]

# ================= VRP =================
def solve_vrp(locations):
    if len(locations) < 2:
        return list(range(len(locations))), 0

    dist_matrix = create_distance_matrix(locations)

    manager = pywrapcp.RoutingIndexManager(len(dist_matrix), 1, 0)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        return int(
            dist_matrix[manager.IndexToNode(from_index)][manager.IndexToNode(to_index)] * 1000
        )

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    solution = routing.SolveWithParameters(search_params)

    if solution is None:
        return list(range(len(locations))) + [0], 0

    route = []
    index = routing.Start(0)

    while not routing.IsEnd(index):
        route.append(manager.IndexToNode(index))
        index = solution.Value(routing.NextVar(index))

    route.append(0)

    total_distance = solution.ObjectiveValue() / 1000

    return route, total_distance

# ================= API =================

@app.get("/")
def home():
    return {"message": "🚀 Hyperlocal Delivery Backend Running"}

# 🔹 CREATE ORDER
@app.post("/order")
def create_order(order: Order):
    try:
        order_id = str(uuid.uuid4())

        new_order = {
            "id": order_id,
            "lat": order.lat,
            "lng": order.lng,
            "status": "pending"
        }

        orders_collection.insert_one(new_order)

        return {"message": "Order created", "order": new_order}

    except Exception as e:
        return {"error": str(e)}

# 🔹 GET ALL ORDERS
@app.get("/orders")
def get_orders():
    try:
        orders = list(orders_collection.find({}, {"_id": 0}))
        return {"orders": orders}

    except Exception as e:
        return {"error": str(e)}

# 🔹 GET DRIVERS
@app.get("/drivers")
def get_drivers():
    return {"drivers": drivers_db}

# 🔹 ASSIGN DRIVER + OPTIMIZE
@app.post("/assign")
def assign_driver():
    try:
        orders = list(orders_collection.find({"status": "pending"}, {"_id": 0}))

        if not orders:
            return {"message": "No pending orders"}

        driver = drivers_db[0]

        locations = [{"lat": driver["lat"], "lng": driver["lng"]}] + orders

        route, dist = solve_vrp(locations)

        return {
            "driver": driver,
            "route_order": route,
            "total_distance": dist,
            "orders": orders
        }

    except Exception as e:
        return {"error": str(e)}

# 🔹 OPTIMIZE ROUTE (MAP FEATURE)
@app.post("/optimize")
def optimize(data: RequestData):
    try:
        locations = [{"lat": loc.lat, "lng": loc.lng} for loc in data.locations]

        if len(locations) < 2:
            return {
                "optimized_route": list(range(len(locations))),
                "optimized_distance": 0,
                "naive_distance": 0,
                "efficiency_gain_percent": 0
            }

        opt_route, opt_dist = solve_vrp(locations)

        naive_dist = sum(
            distance(locations[i], locations[i+1])
            for i in range(len(locations)-1)
        )

        efficiency = (
            ((naive_dist - opt_dist) / naive_dist) * 100
            if naive_dist != 0 else 0
        )

        # ✅ SAVE ROUTE
        orders_collection.insert_one({
            "type": "route",
            "locations": locations,
            "optimized_route": opt_route,
            "optimized_distance": opt_dist,
            "naive_distance": naive_dist,
            "efficiency": efficiency
        })

        return {
            "optimized_route": opt_route,
            "optimized_distance": opt_dist,
            "naive_distance": naive_dist,
            "efficiency_gain_percent": efficiency
        }

    except Exception as e:
        return {"error": str(e)}