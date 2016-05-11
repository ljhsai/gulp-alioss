var gulp = require('gulp');
var oss = require('../index');

gulp.task('upload_to_oss', function(){
    var options = {
        accessKeyId: '6fVgt8d5fGWgESXz',
        secretAccessKey: '80KOHp7pXGP3diOcRix5ITMeyeJo6F',
        // endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
        endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
        apiVersion: '2013-10-15',
        prefix: 'plantUnion/',
        bucket: 'qhcdn'
    };
    return gulp.src(['./js/**/*']).pipe(oss(options));
});
