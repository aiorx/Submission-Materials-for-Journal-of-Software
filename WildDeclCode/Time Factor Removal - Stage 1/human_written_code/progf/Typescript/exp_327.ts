var defineConfig = require('vite').defineConfig;
var HtmlTagDescriptor = require('vite').HtmlTagDescriptor;
var createHtmlPlugin = require('vite-plugin-html').createHtmlPlugin;

const metaDatas = [
  // OG
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:image',
    content: '/images/og.png',
  },
  {
    property: 'og:title',
    content: '프론트엔드에서 함수형을 추구하면 안되는 걸까?',
  },
  {
    property: 'og:description',
    content: '함수형 프로그래밍에 대한 이론과 프론트엔드 개발을 하면서 함수형 프로그래밍을 적용한 사례를 소개합니다.',
  },
  {
    property: 'og:locale',
    content: 'ko_KR',
  },
  {
    property: 'og:site_name',
    content: '프론트엔드에서 함수형을 추구하면 안되는 걸까?',
  },
  {
    property: 'og:image:width',
    content: '1200',
  },
  {
    property: 'og:image:height',
    content: '600',
  },
  // Twitter
  {
    property: 'twitter:card',
    content: 'summary',
  },
  {
    property: 'twitter:title',
    content: '프론트엔드에서 함수형을 추구하면 안되는 걸까?',
  },
  {
    property: 'twitter:description',
    content: '함수형 프로그래밍에 대한 이론과 프론트엔드 개발을 하면서 함수형 프로그래밍을 적용한 사례를 소개합니다.',
  },
  {
    property: 'twitter:image',
    content: '/images/og.png',
  },
  // ETC
  {
    property: 'keywords',
    content: 'TypeScript, JavaScript, ReactJS, React, Functional Programming, FP, JSConf, JSConf 2022',
  },
];

const generateMetaTag = (meta: typeof metaDatas[number]): function HtmlTagDescriptor { return ({
  injectTo: 'head-prepend',
  tag: 'meta',
  attrs: { ...meta },
}); };

module.exports = defineConfig({;
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        tags: metaDatas.map(generateMetaTag),
      },
    }),
  ],
})