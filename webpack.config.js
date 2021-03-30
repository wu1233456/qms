const path = require('path');
const _ = require("underscore");
const fs = require("fs");

const {merge} = require('webpack-merge');
let includes = require('array-includes');
process.traceDeprecation = true;
const TARGET = process.env.npm_lifecycle_event;
let isDev = includes(TARGET.split(":"), 'dev')


const webpack = require('webpack');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require('webpack-uglify-harmony-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyPlugin = require('copy-webpack-plugin');

//=========================
//copy common dir
//=========================
const copydir = require('copy-dir');
let templatesDir = path.resolve(__dirname, 'templates');
if(!fs.existsSync(templatesDir)){
    fs.mkdirSync(templatesDir)
}
copydir.sync(path.resolve(__dirname, 'public/views/common'),
    path.resolve(__dirname, 'templates/common'),
    {
    utimes: true,  // keep add time and modify time
    mode: true,    // keep file mode
    cover: true    // cover file when exists, default is true
});

//=========================
//webpack html/js bundle
//=========================
const entry = require("./webpack-entry")
const viewPlugins = _.reduce(_.keys(entry), function (memo, key){
    let plugin = new HtmlWebpackPlugin({
        template: path.join(__dirname, `./public/views/${key}.html`),
        //以static文件夹为根目录
        filename: path.join(__dirname, `./templates/${key}.html`),
        alwaysWriteToDisk: true,
        chunks:[key],
    })
    memo.push(plugin)
    return memo;
}, [])



//====================分别设置组内不同组员的proxy服务器地址======================
let localIp;
function getLocalIp(){
    if(localIp){
        return localIp;
    }

    let interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                localIp = alias.address;
                return alias.address;
            }
        }
    }
}

localIp = getLocalIp();
let backendServer = "http://localhost:5000";
switch (localIp){
    case "xxxx":
        //johney IP
        backendServer = `http://${localIp}:5000`;
        break;
    //如果是其它人的IP, 请自己添加case条件
    default:
        backendServer = "http://localhost:5000";
}

 let common= {
    context:`${__dirname}/public`,
    entry:entry,
    module: {
        rules: [
            // loader的配置
            {
                test: /\.scss$/,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    {
                        loader: MiniCssExtractPlugin.loader,
                        //解决图片引入路径问题
                        options: {
                            outputPath: 'css' ,

                        }
                    },
                    // 将 CSS 转化成 CommonJS 模块
                    'css-loader',
                    // 将 Sass/css编译成 CSS
                    'sass-loader'
                ]

            },
            {
                // 处理css资源
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        //解决图片引入路径问题
                        options: {
                            outputPath: 'css' ,

                        }
                    },
                    'css-loader']
            },
            {
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: isDev?"[name].[ext]":"[name]-[hash:5].[ext]",
                    // 关闭es6模块化
                    esModule: false,
                    outputPath: 'img'
                }
            },
            {
                // 处理html中img资源
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                // 处理其他资源
                exclude: /\.(html|js|css|scss|jpg|png|gif)/,
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash:5].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        ...viewPlugins,
        new HtmlWebpackHarddiskPlugin({
            //运行时会强行把html文件给编译生成到这里
            outputPath: path.resolve(__dirname, 'templates')
        }),
        new FaviconsWebpackPlugin({
            logo:path.join(__dirname, `./public/img/favicon.png`),
            prefix: 'icon/',
            title: 'title',
            icons:{
                android: true,              // Create Android homescreen icon. `boolean`
                appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
                appleStartup: false,         // Create Apple startup images. `boolean`
                coast: false,      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
                favicons: true,             // Create regular favicons. `boolean`
                firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
                windows: true,              // Create Windows 8 tile icons. `boolean`
                yandex: false
            }
        }),
    ],

}

let dev={
    mode: 'development',
    watch:true,
    watchOptions:{
        ignored:/node_modules/,
        aggregateTimeout: 300, //300毫秒后再做动作
        poll:1000, //每秒询问1000次
    },
    output: {
        path: path.join(__dirname, 'static'),  //请填写绝对地址
        filename:"js/[name].js?[hash:5]",
        chunkFilename:"js/[name]-chunk.js?[chunkhash:5]",
        publicPath: "/static/", //这个路径是浏览器上显示的路径
    },
    devServer: {
        contentBase:path.join(__dirname, 'templates'),  // Relative directory for base of server
        compress: true, // 启动 gzip 压缩
        hot: true, // Live-reload
        inline: true,
        open: true,
        port: 3000,
        host: 'localhost', // Change to '0.0.0.0' for external facing server
        // host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
        proxy:{
            ["!/static/**/*"]:{
                target: backendServer,
                secure: false
            }
        },
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // Define production build to allow React to strip out unnecessary checks
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':JSON.stringify('development')
        }),
        new HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
    ],
}

let prod ={
    mode: 'production',
    output: {
        path: path.join(__dirname, 'static'),  //请填写绝对地址
        filename: 'js/[name]-[hash:5].js',
        chunkFilename:"js/[name]-[chunkhash:5]-chunk.js",
        publicPath: "/static/", //这个路径是浏览器上显示的路径
    },
    devtool:false,
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':JSON.stringify('production'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[hash:5].css'
        })
    ]

}

let ug = {
    plugins:[
        new UglifyJsPlugin()
    ]
}

let resultConfig = common;

if(includes(TARGET.split(":"), 'prod')){
    resultConfig = merge(resultConfig, prod);
}
else{
    resultConfig = merge(resultConfig, dev);
}

if(includes(TARGET.split(":"), 'ug')){
    resultConfig = merge(resultConfig, ug);
}

module.exports = resultConfig;

