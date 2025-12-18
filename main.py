from fastapi import FastAPI
from app.routes import pacientes_routes, citas_routes, profesionales_routes, disponibilidades_routes
from app.views import db_config_form

app = FastAPI(title="Agenda Service")


app.include_router(pacientes_routes.router)
app.include_router(citas_routes.router)
app.include_router(profesionales_routes.router)
app.include_router(disponibilidades_routes.router)
