from flask import Flask
from src.setup import setup


application = app = Flask(__name__)
setup(app)


if(__name__ == "__main__"):
    from flask_debugtoolbar import DebugToolbarExtension
    toolbar = DebugToolbarExtension()
    toolbar.init_app(app)
    app.run(debug=True)