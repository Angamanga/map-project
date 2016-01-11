var pleaseAjax = require('please-ajax');

module.exports = function() {

    pleaseAjax.get('/data', {
        success(data){
            console.log(data);
        }
    });
}
