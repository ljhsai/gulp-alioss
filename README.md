# gulp-alioss-stream
Aliyun Oss Client for Gulp

### Install
``` bash
npm install gulp-alioss-stream
```
### DEMO
``` node
var gulp = require('gulp');
var oss = require('gulp-alioss-stream');
gulp.task('oss', function(){
    var options = {
        accessKeyId: '********',
        secretAccessKey: '*********',
        endpoint: 'http://oss-cn-***.aliyuncs.com',
        apiVersion: '2013-10-15',
        prefix: 'assets/js',
        bucket: 'test',
        maxUpCount: 10, //最大上传文件数，default 10
        maxErrCount: 5  //上传失败重试次数，default 5
    };
    //./js/a.js -> <prefix>/a.js
    // ......
    //./js/b/a.js -> <prefix>/b/a.js
    return gulp.src(['./js/**/*']).pipe(oss(options));
});
```
### 操作结果

``` bash
cd /path/to/gulpfile.js/
gulp oss
[14:50:59] Using gulpfile ~/path/to/gulpfile.js
[14:50:59] Starting 'oss'...
[14:50:59] Finished 'oss' after *** ms
[14:50:59] uploaded: assets/a.js
[14:50:59] uploaded: assets/b/a.js
[14:50:59] total: 5 success: 5 fail: 0
....
```

