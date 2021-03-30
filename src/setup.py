from src.controller.viewController import viewController
from flask import request
from src.constants.errorCode import errorCode

class ToolFuncs():
    def __init__(self):
        pass

    def getParams(self, paramNameArr, defaultValueArr=None):
        result = {}
        if type(paramNameArr) is not list:
            raise Exception("paramNameArr type error ")
            return

        for ii, pN in enumerate(paramNameArr):
            p = pDef = None
            if defaultValueArr is not None:
                p = pDef = defaultValueArr[ii]
            if request.method == "POST":
                p = request.form.get(pN, pDef)
            elif request.method == "GET":
                p = request.args.get(pN, pDef)
            result[pN] = p
        return result

    def getParam(self, paramName, defaultValue=None):
        p = pDef = None
        if defaultValue is not None:
            p = pDef = defaultValue
        if request.method == "POST":
            p = request.form.get(paramName, pDef)
        elif request.method == "GET":
            p = request.args.get(paramName, pDef)
        return p

    def success(self, data=None):
        if data is not None:
            return {
                "code": errorCode.OK[0],
                "message": errorCode.OK[1],
                "data": data
            }
        else:
            return {
                "code": errorCode.OK[0],
                "message": errorCode.OK[1],
            }

    def fail(self, failInfo):
        return {
            "code": failInfo[0],
            "message": failInfo[1],
        }


f = ToolFuncs()

def setup(app):
    app.config['SECRET_KEY'] = 'hou'
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False  # 不拦截重定向

    viewController(app, f)
