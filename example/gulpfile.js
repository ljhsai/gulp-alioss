var gulp = require('gulp');
var oss = require('../index');

gulp.task('upload_to_oss', function(){
    var options = {
        accessKeyId: 'xxxxxxxxx',
        secretAccessKey: 'xxxxxxx',
        // endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
        endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
        apiVersion: '2013-10-15',
        prefix: 'xxxxxxx',
        bucket: 'qhcdn'
    };
    return gulp.src(['./js/**/*']).pipe(oss(options));
});
