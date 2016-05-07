// PLUGIN_NAME: gulp-oss
const PLUGIN_NAME = 'gulp-oss';

var path = require('path');
var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var colors = require('gulp-util').colors;
var log = require('gulp-util').log;
var ALY = require('aliyun-sdk');
var aliyunStream = require('aliyun-oss-upload-stream');

var fs = require("fs");
var Moment = require('moment');

function oss(option) {
    if (!option) {
        throw new PluginError(PLUGIN_NAME, 'Missing option!');
    }
    if(!option.bucket){
        throw new PluginError(PLUGIN_NAME, 'Missing option.bucket!');
    }

    var ossStream = aliyunStream(new ALY.OSS({
        accessKeyId: option.accessKeyId,
        secretAccessKey: option.secretAccessKey,
        endpoint: option.endpoint,
        apiVersion: option.apiVersion ||  '2013-10-15'
    }));

    var version = Moment().format('YYMMDDHHmm');

    var listfn = [];
    var maxUpCount = option.maxUpCount || 10;
    var _count = 0;
    var maxErrCount = option.maxErrCount || 5;
    var fnMap = {};

    var getFileKey = function(option, file){
        return option.prefix
            + ((!option.prefix || option.prefix[option.prefix.length - 1]) === '/' ? '' : '/')
            + (option.versioning ? version + '/' : '')
            + path.relative(file.base, file.path).replace(/\\/g, "/");
    };

    var getUpfileFn = function(fileKey, file, option){
        return function(){
            _count ++;
            var upload = ossStream.upload({
                Bucket: option.bucket,
                Key: fileKey
            });
            upload.on('error', function (error) {
                log('ERR:', colors.red(fileKey + "\t" + error.code));
                var obj = fnMap[fileKey];
                if(obj){
                    if(obj.errCount > maxErrCount){
                        log('ERR:', colors.red(fileKey + "\t" + error.code));
                    }else{
                        obj.errCount ++;
                        obj.fn();
                        log('reset up:', colors.red(fileKey + "\t" + obj.errCount));
                    }
                }
            });

            upload.on('part', function (part) {
                // console.log('part:', part);
            });

            upload.on('uploaded', function (details) {
                log('uploaded:', colors.green(fileKey));
                _count--;
                if (_count < maxUpCount) {
                    var fn = listfn.shift();
                    if (fn) fn();
                }
            });

            var read = fs.createReadStream(file.clone().path);
            read.pipe(upload);
        };
    };

    return through2.obj(function (file, enc, cb) {
        if(file.isDirectory()) return cb();
        if(file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        if(file.contents.length >= option.maxSize){
            log('WRN:', colors.red(file.path + "\t" + file.contents.length));
            return cb();
        }

        var key = getFileKey(option, file);
        var fn = getUpfileFn(key, file.clone(), option);
        fnMap[key] = {errCount:0, fn:fn};

        if (_count < maxUpCount) {
            fn();
        } else {
            listfn.push(fn);
        }

        this.push(file);
        return cb();
    });
}

module.exports = oss;
