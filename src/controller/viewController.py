from flask import render_template


def viewController(app, toolFuncs={}):
    @app.route('/', methods=["GET"])
    def index():
        return render_template('index.html')

    ############
    # new页面，
    ############
    @app.route('/news', methods=["GET"])
    @app.route('/news/', strict_slashes=False, methods=["GET"])
    def news_index():
        return render_template('news/index.html')

    @app.route('/news/<subpage>', methods=["GET"])
    def news_subpage(subpage="index"):
        return render_template("news/%s.html" % (subpage))

    ############
    # people页面，研究团队,总共有导师、博士研究生、硕士研究生、硕士毕业生四个类别
    ############
    @app.route('/people', methods=["GET"])
    @app.route('/people/', strict_slashes=False, methods=["GET"])
    def people_index():
        return render_template('people/teacher/index.html')

    @app.route('/people/teacher/<subpage>', methods=["GET"])
    def teacher_subpage(subpage="index"):
        return render_template("people/teacher/%s.html" % (subpage))


    ############
    # aboutus页面
    ############
    @app.route('/aboutus', methods=["GET"])
    @app.route('/aboutus/', strict_slashes=False, methods=["GET"])
    def aboutus_index():
        return render_template('aboutus/index.html')


    ############
    # joinus页面
    ############
    @app.route('/joinus', methods=["GET"])
    @app.route('/joinus/', strict_slashes=False, methods=["GET"])
    def joinus_index():
        return render_template('joinus/index.html')

    ############
    # link页面
    ############
    @app.route('/link', methods=["GET"])
    @app.route('/link/', strict_slashes=False, methods=["GET"])
    def link_index():
        return render_template('link/index.html')
