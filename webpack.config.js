// Librairie path, utiliser path.join pour éviter les "/", "\" selon OS
const path = require('path');

const HtmlWebpackPlugin = require("html-webpack-plugin"); // On importe notre plugin
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = {

    // entry point
    entry: {
        main: path.join(__dirname, 'src', 'index.js'),
        form: path.join(__dirname, 'src', 'form','form.js'),
        topbar: path.join(__dirname, 'src', 'assets', 'js','topBar.js')
    },

    // Point de sortie 
    output: {
        path: path.join(__dirname, 'dist'), // la ou on veut générer le fichiers de sortie (les bundles JS)
        filename: "[name].bundle.js", // le nom du fichier de sortie ([name] fait référence au nom du point d'entrée)
    },

    module: {
        // On applique les loaders ()
        rules: [
            {
                test: /\.js/,  // Regex tout fichiers qui se termine par .js
                exclude: /(node_modules)/,  // On exclue tout les fichiers .js dans node_modules
                use: ['babel-loader'],
            },
            {
                test: /\.scss/,
                exclude: /(node_modules)/,
                use: ["style-loader", "css-loader", "sass-loader"] // CSS loader car SASS est convertit en CSS
            }
        ]
    },

    plugins: [
        // Quand on survole: on voit options? car il prend un objets d'options facultatif
        // Le HtmlWebpackPlugin vient greffer les bundles dans le index.html
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'src', 'assets'),
                    to: 'assets'  // il sait que c'est dans le dossier dist
                }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'src', 'index.html'),
            chunks: ['main', 'topbar'] // topbar commun à toutes les pages
        }),
        new HtmlWebpackPlugin({
            filename: 'form.html',
            template: path.join(__dirname, 'src', 'form','form.html'),
            chunks: ['form', 'topbar'] // topbar commun à toutes les pages
        }),
    ],

    stats: "minimal",
    devtool: "source-map",
    mode: "development",
    devServer: {
        static: path.join(__dirname, "dist"),
        open: true,
        port: 4000,
    }


}