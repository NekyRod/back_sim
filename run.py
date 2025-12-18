from flask import Flask, app,jsonify, render_template, send_from_directory

def create_app():
    app = Flask(__name__, template_folder="app/views")  # Carpeta de plantillas
    # Configuración personalizada de JWT usando el secret key centralizado
    app.config['JWT_SECRET_KEY'] = SECRET_KEY
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    jwt = JWTManager(app)  # Inicializar JWT Manager

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory('app/views/img', 'favicon.ico')
    
     # Health‐check sencillo
    @app.route("/health")
    def health():
        return jsonify(status="UP"), 200
    # Rutas para las páginas HTML
    @app.route("/")
    def index():
        return render_template("login.html")   # Renderiza app/views/index.html

    @app.route("/base")
    def base():
        return render_template("base.html")
   
    print("Aplicación creada exitosamente")
    return app

# Creamos el WSGI callable para Waitress
app = create_app()
app.debug = True  # Habilitar modo debug para desarrollo

if __name__ == "__main__":
    # Desarrollo
    app.run(host="0.0.0.0", port=5800, debug=True)