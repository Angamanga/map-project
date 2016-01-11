
module.exports = function(app){
const PROJECT_DATA_FILE = '/projectData.csv'
    app.get('/',function(req,res){
        res.render('index');
    });
    app.get('/data', function (req,res) {
        var filePath = __dirname + PROJECT_DATA_FILE;
        res.sendFile(filePath);
    });
}