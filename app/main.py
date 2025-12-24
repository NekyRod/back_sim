from fastapi import FastAPI
from app.routes import pacientes_routes, citas_routes, profesionales_routes, disponibilidades_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Agenda Service")
origins = [
    "http://localhost:5173",  # Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(pacientes_routes.router)
app.include_router(citas_routes.router)
#app.include_router(profesionales_routes.router)
#app.include_router(disponibilidades_routes.router)
