const { src, dest, watch, series, parallel } = require('gulp');

//scss
const sass = require('gulp-dart-sass');
const plumber = require('gulp-plumber'); // エラーが発生しても強制終了させない
const notify = require('gulp-notify'); // エラー発生時のアラート出力
const sassGlob = require('gulp-sass-glob-use-forward');
const cssmqSort = require('gulp-merge-media-queries'); //メディアクエリをまとめる
const gulpStylelint = require('gulp-stylelint');
const postcss = require('gulp-postcss'); // PostCSS利用
const cssDeclarationSorter = require('css-declaration-sorter');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css'); // 圧縮
const rename = require('gulp-rename'); // ファイル名変更
const sourcemaps = require('gulp-sourcemaps'); // ソースマップ作成
const webp = require('gulp-webp');
const pug = require('gulp-pug');

//js babel
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

//画像圧縮
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

//ファイル監視
const browserSync = require('browser-sync');

//参照元パス
const srcPath = {
	pug: 'src/pug/**/*.pug',
	css: 'src/scss/**.scss',
	js: 'src/js/*.js',
	img: 'src/images/**/*',
};

//出力先パス
const destPath = {
  pug: 'htdocs/',
	css: 'htdocs/css/',
	js: 'htdocs/js/',
	img: 'htdocs/images/',
};

//pug
const htmlPug = () =>{
  return src(srcPath.pug)
    .pipe(pug({
      pretty:true
    }))
    .pipe(dest(destPath.pug))
}

//sass
const cssSass = () => {
	return src(srcPath.css) //コンパイル元
		.pipe(sourcemaps.init()) //gulp-sourcemapsを初期化
		.pipe(
			plumber(
				//エラーが出ても処理を止めない
				{
					errorHandler: notify.onError('Error:<%= error.message %>'),
					//エラー出力設定
				}
			)
		)
		.pipe(sassGlob())
		.pipe(sass.sync({ outputStyle: 'expanded' }))
		.pipe(cssmqSort()) //メディアクエリソート
		.pipe(postcss([autoprefixer()])) //prefixer自動付与
		.pipe(postcss([cssDeclarationSorter({ order: 'smacss' })])) //CSSソート
		.pipe(gulpStylelint({ fix: true }))
		.pipe(sourcemaps.write('/maps')) //ソースマップの出力
		.pipe(dest(destPath.css)) //コンパイル先
		.pipe(cleanCSS()) // CSS圧縮
		.pipe(
			rename({
				extname: '.min.css', //.min.cssの拡張子にする
			})
		)
		.pipe(dest(destPath.css));
};

// babelのトランスパイル、jsの圧縮
const jsBabel = () => {
	return src(srcPath.js)
		.pipe(
			plumber(
				//エラーが出ても処理を止めない
				{
					errorHandler: notify.onError('Error: <%= error.message %>'),
				}
			)
		)
		.pipe(
			babel({
				presets: ['@babel/preset-env'], // gulp-babelでトランスパイル
			})
		)
		.pipe(dest(destPath.js))
		.pipe(uglify()) // js圧縮
		.pipe(rename({ extname: '.min.js' }))
		.pipe(dest(destPath.js));
};

//画像圧縮（デフォルトの設定）
const imgImagemin = () => {
	return src(srcPath.img)
		.pipe(
			imagemin(
				[
					imageminMozjpeg({
						quality: 80,
					}),
					imageminPngquant(),
					imageminSvgo({
						plugins: [
							{
								removeViewbox: false,
							},
						],
					}),
				],
				{
					verbose: true,
				}
			)
		)
		.pipe(dest(destPath.img));
};

const changeWebp = () => {
	return src(srcPath.img)
		.pipe(
			rename((path) => {
				path.basename += path.extname;
			})
		)
		.pipe(webp())
		.pipe(dest(destPath.img));
};

//ローカルサーバー立ち上げ、ファイル監視と自動リロード
const browserSyncFunc = () => {
	browserSync.init(browserSyncOption);
};
const browserSyncOption = {
	proxy: 'http://localhost/', //環境によって変更する
	open: true,
	reloadOnRestart: true,
};

//リロード
const browserSyncReload = (done) => {
	browserSync.reload();
	done();
};

//ファイル監視
const watchFiles = () => {
	watch(srcPath.pug, series(htmlPug, browserSyncReload));
	watch(srcPath.css, series(cssSass, browserSyncReload));
	watch(srcPath.js, series(jsBabel, browserSyncReload));
	watch(srcPath.img, series(imgImagemin, browserSyncReload));
	watch(srcPath.img, series(changeWebp, browserSyncReload));
};

exports.default = series(
	series(htmlPug,cssSass, jsBabel, imgImagemin, changeWebp),
	parallel(watchFiles, browserSyncFunc)
);
