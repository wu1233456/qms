class ErrorCode():
    OK=(0,"OK")
    MISS_PARAMETER=(-1, "miss parameter")
    INVALID_PID=(-2, "invalid pid")
    INVALID_BOMID=(-3, "invalid bomid")
    EXISTS_SAME_BOM=(-4, "exists same bom")

errorCode = ErrorCode()

if __name__ == "__main__":
    for ii in dir(errorCode):
        print(ii)
