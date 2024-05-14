from flask import Flask


def create_app(test_config =None):
    app = Flask(__name__)

    if test_config:
        app.config.update(test_config)


    return app
 