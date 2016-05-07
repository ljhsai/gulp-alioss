var gulp = require('gulp');
var oss = require('../index');

gulp.task('upload_to_oss', function(){
    var options = {
        accessKeyId: '******',
        secretAccessKey: '*******',
        endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
        apiVersion: '2013-10-15',
        prefix: 'xxxxxx',
        bucket: 'xxxxxx'
    };
    return gulp.src(['./js/**/*']).pipe(oss(options));
});
