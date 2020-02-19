# 웹폰트
무료 폰트를 웹폰트로 사용하기

제 개인적인 사용이 목적이이며, 정식 웹폰트가 나올시에는 그것을 사용해주시길  바랍니다.
나눔고딕은 [구글웹폰트][nanum]을 사용해주시길 바랍니다.

##나눔글꼴 
네이버에서 만들어 무료로 배포한 나눔글꼴을 웹폰트로 만들었습니다.
[나눔글꼴이야기 PDF 보기][nanum story]


**나눔바른고딕**

HTML 문서에 적용
```
<style type="text/css">
	.text {font-family: 'NanumBarunGothic', '나눔바른고딕', sans-serif;}
</style>
```


##우아한 형제들

**배달의 민족 한나체**
한나체 [라이센스 보기][license1]

**배달의 민족 주아체**
주아체 [라이센스 보기][license2]

웹사이트 HTML문서의 ``<head>``안에 아래 코드를 넣으면 됩니다.
```
<link href="https://cdn.rawgit.com/singihae/Webfonts/master/style.css" rel="stylesheet" type="text/css" />
```

**@import**
CSS파일 및 ``<head>``안의 스타일 시트에 아래 코드를 넣으면 됩니다.
```
@import url('https://cdn.rawgit.com/singihae/Webfonts/master/style.css');
```

##적용하기
폰트를 적용하려면 폰트 이름을 적용하길 원하는 CSS에 다음과 같이 추가하면 됩니다.
```
font-family: 'NanumBarunGothic', '나눔바른고딕', sans-serif;
```

HTML 문서에 적용
```
<style type="text/css">
.jua {font-family:'BM JUA','배달의민족 주아',sans-serif;}
.hana{font-family:'BM HANNA','배달의민족 한나', sans-serif; }
</style>
```
##피드백
[Issues][issues]로 해주시면 됩니다.

p.s 개인적으로 사용함을 위해 만든만큼 업데이트가 느릴 수 있고, 적용이 안될 수 있습니다.
적용이 안될 시에는 피드백 부탁드립니다.

무료폰트 나눔글꼴 모두 업로드 할 예정입니다.

[nanum]: http://fonts.googleapis.com/earlyaccess/nanumgothic.css
[nanum story]: http://static.campaign.naver.com/0/hangeul/2014/doc/nanum_story.pdf
[license1]: http://www.woowahan.com/license.html?keepThis=true&TB_iframe=true&height=620&width=659&modal=true
[license2]: http://www.woowahan.com/license-jua.html?keepThis=true&TB_iframe=true&height=620&width=659&modal=true
[issues]: https://github.com/singihae/Webfonts/issues
