
module.exports = function(app){
    const PROJECT_DATA_FILE = '/projectData.csv';
    const COUNTY_BOUNDARIES_FILE = '/counties.geojson';
    //rendering index
    app.get('/',function(req,res){
        res.render('index');
    });
    //sending csv-file for project-data
    app.get('/csv', function (req,res) {
        var filePath = __dirname + PROJECT_DATA_FILE;
        res.sendFile(filePath);
    });

    //sending geojson-file for county-boundaries
    app.get('/geojson',function(req,res){
        var filePath = __dirname + COUNTY_BOUNDARIES_FILE;
        res.sendFile(filePath);
    });
}