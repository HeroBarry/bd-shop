//载入插件
var gulp = require('gulp'),
    contentIncluder = require('gulp-content-includer'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    htmlreplace = require('gulp-html-replace'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    filter = require('gulp-filter'),
    reload = browserSync.reload,
    concatCss = require('gulp-concat-css'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    changed = require('gulp-changed');

// 定义源码路径
var paths = {
    js: 'src/js/*.js',
    sass: 'src/sass/*.scss',
    img: 'src/image/*',
    html: 'src/html/',
    font: 'src/font/',
    libs: 'src/libs/',
};
//定义部署路径
var dist = './dist';
//定义包
var pkg = {
    version: "1.0.0"
};


// 编译sass
gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions', 'Android >= 4.0', 'Firefox >= 20'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(changed('./css'))
        .pipe(gulp.dest('./css'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({
            message: 'sass 编译完成'
        }));
});

//html编译
gulp.task('html', function() {
    gulp.src([paths.html + 'manage/*.html', paths.html + 'content/*.html'])
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('./page'));
    gulp.src(paths.html + 'index.html')
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('./'))
        .pipe(notify({
            message: 'html 编译完成'
        }));
});


//html压缩、css路径替换
gulp.task('htmlmin', function() {
    return gulp.src('./page/*.html')
        .pipe(replace('/src/', '/'))
        .pipe(htmlreplace({
            'css': '/css/bundle.css'
        }))
        .pipe(gulp.dest(dist + "/page"))
        .pipe(notify({
            message: 'html 发布完成'
        }));

});

gulp.task('index', function() {
    return gulp.src('./index.html')
        .pipe(replace('/src/', '/'))
        .pipe(htmlreplace({
            'css': '/css/bundle.css'
        }))
        .pipe(gulp.dest(dist))
        .pipe(notify({
            message: 'index 发布完成'
        }));
});

//css合并压缩
gulp.task('css', function() {
    gulp.src(['./css/{index,style}.css'])
        .pipe(replace('/src/', '/'))
        .pipe(concatCss("bundle.css"))
        .pipe(minifycss())
        .pipe(changed(dist + "/css"))
        .pipe(gulp.dest(dist + '/css'))
        .pipe(notify({
            message: 'css 发布完成'
        }));
    gulp.src(['./css/member.css', './css/manage.css'])
        .pipe(replace('/src/', '/'))
        .pipe(minifycss())
        .pipe(gulp.dest(dist + '/css'))
        .pipe(notify({
            message: 'css 发布完成'
        }));
});



// libs发布
gulp.task('libs', function() {
    return gulp.src(paths.libs + '/**/**.*')
        .pipe(replace('/src/', '/'))
        .pipe(gulp.dest(dist + '/libs'))
        .pipe(notify({
            message: 'libs 编译完成'
        }));
});

// font发布
gulp.task('font', function() {
    return gulp.src(paths.font + '/iconfont.*')
        .pipe(gulp.dest(dist + '/font'))
        .pipe(notify({
            message: 'font 编译完成'
        }));
});

// 检测、压缩js文件
gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(replace('/src/', '/'))
		.pipe(uglify())
        .pipe(gulp.dest(dist + '/js'))
        .pipe(notify({
            message: 'js 发布完成'
        }));
});

// 压缩图片
gulp.task('img', function() {
    return gulp.src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest(dist + '/image'))
        .pipe(notify({
            message: '图片发布完成'
        }));
});

// 清理 /dist 目录

gulp.task('clean', function() {
    del.sync([dist, './page/*.html', './css/*.css', './index.html'], {
        force: true
    });
});



// 建立本地服务器\实时刷新浏览器
gulp.task('server', ['html', 'sass'], function() {
    browserSync.init({
        server: "./",
        scrollProportionally: false,
        // open: "external",
        port: 4865,
        browser: "chrome"
    });

    // 监控文件变化
    gulp.watch(paths.sass, ['sass']);
    gulp.watch([paths.html + "/**/*.html", paths.html + '/index.html'], ['html']);
    gulp.watch(["./css/*.css", "./page/*.html", "./index.html", paths.js, paths.img]).on('change', reload);
});


// 执行默认任务
gulp.task('default', ['server']);

//发布前的编译sass，html
gulp.task('col', ['clean'], function() {
    gulp.start('sass', 'html');
});
//执行发布任务
gulp.task('deploy', function() {
    gulp.start('index', 'css', 'htmlmin', 'js', 'img', 'font');
});


// 执行帮助任务
gulp.task('help', function() {
    console.log('	gulp deploy		文件发布./dist目录');
    console.log('	gulp			自动启动谷歌浏览器,实时监控，适合开发');
    console.log('	gulp help	    gulp参数说明');
    console.log('	gulp col	编译');
});
