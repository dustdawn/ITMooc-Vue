<template>
  <div>

    <div class="learing-course">

      <div class="course-cont">
        <div class="course-cont-top-video" style="position: relative;">
          <div class="video-box">
            <div class="top text-center">
             {{coursename}}
            </div>
            <div class="video text-center" style="padding-right: 55px;">
              <div class="video-mine">
                <!--<div class="cls-text"><a class="media" href=".//plugins/js-pdf/NodeJSDeveloperGuid.pdf"></a></div>-->
                <div class="cls-video">
                  <div id="vdplay">

                    <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions">
                    </video-player>
                  </div>
                  <div class="vdControl">
                    <!--<div class="play" onclick="vdPlay()">播放</div>-->
                  </div>
                </div>
              </div>
            </div>
            <div class="course-nav">
              <div class="nav-stacked text-center">
                <li class="nav"><a :href="url" class="glyphicon glyphicon-list-alt"><span>目录</span></a></li>
              </div>
            </div>

            <div class="navCont">
              <div class="course-weeklist">
                <div class="nav nav-stacked" v-for="(teachplan_first, index) in teachplanList">
                  <div class="tit nav-justified text-center"><i class="pull-left glyphicon glyphicon-th-list"></i>{{teachplan_first.pname}}<i class="pull-right"></i></div>
                  <li  style="text-align: left"   v-if="teachplan_first.children!=null" v-for="(teachplan_second, index) in teachplan_first.children"><i class="glyphicon glyphicon-check"></i>
                    <a :href="url" @click="study(teachplan_second.id)">
                      {{teachplan_second.pname}}
                    </a>
                  </li>

                 <!-- <div class="tit nav-justified text-center"><i class="pull-left glyphicon glyphicon-th-list"></i>第一章<i class="pull-right"></i></div>
                  <li  ><i class="glyphicon glyphicon-check"></i>
                    <a :href="url" >
                      第一节
                    </a>
                  </li>-->
                  <!--<li><i class="glyphicon glyphicon-unchecked"></i>为什么分为A、B、C部分</li>-->
                </div>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
  let sysConfig = require('@/../config/sysConfig')
  import * as courseApi from '../api/course'
  import * as systemApi from '@/base/api/system'
  import utilApi from '../../../common/utils';


  export default {
    components: {},
    data() {
      return {
        url:'',//当前url
        courseId:'',//课程id
        chapter:'',//章节Id
        coursename:'课程名称',//课程名称
        coursepic:'',//课程图片
        teachplanList:[],//课程计划
        playerOptions: {//播放参数
          autoplay: false,
          controls: true,
          sources: [{
            type: "application/x-mpegURL",
            src: ''
          }]
        },

      }
    },

    methods: {
      playvideo(video_src){
        console.log(video_src)
        this.playerOptions.sources[0].src = video_src
        this.playerOptions.autoplay = true
      },

      //开始学习
      study(chapter){
        courseApi.get_media(this.courseId, chapter).then(res=>{
          console.log(res)
          if (res.success) {
            //获取视频播放地址
            let fileUrl = res.fileUrl;//相对路径
            let videoUrl = sysConfig.videoUrl + fileUrl;//完整播放路径
            this.playvideo(videoUrl)
          } else {
            this.$message.error("该章节未绑定视频资源")
          }
        })
      }

    },
    created(){
        //当前请求的url
      this.url = window.location
      //课程id
      this.courseId = this.$route.params.courseId
      //章节id
      this.chapter = this.$route.params.chapter
      //取出课程Id
      systemApi.course_view(this.courseId).then((view_course)=>{
        console.log("获取课程信息", view_course)
        if (!view_course || !view_course[this.courseId]) {
          this.$message.error("获取课程信息失败")
          return;
        }

        //根据课程id拿到课程信息
        let courseInfo = view_course[this.courseId];
        this.coursename = courseInfo.name;
        //取出teachplan的串
        let teachplanString = courseInfo.teachplan;
        //把串转成对象
        let teachplanObj = JSON.parse(teachplanString);
        //取到课程计划
        this.teachplanList = teachplanObj.children;

        //如果课程计划id不等于0，直接插入该课程计划对应的视频
        if (this.chapter != '0') {
          //获取该课程计划所对应的视频
          this.study(this.chapter)
        } else {
          //找到该课程的第一个课程计划id，取出该课程计划所对应的视频
          //找到该课程的二级课程计划中的第一个课程计划id，取出该课程对应的视频
          for (let i = 0; i < this.teachplanList.length; i++) {
            let firstTeachplan = this.teachplanList[i];
            if (firstTeachplan.children && firstTeachplan.children.length > 0) {
              //取出二级课程计划中第一个
              let secondTeachplan = firstTeachplan.children[0];
              //课程计划的id
              let teachplanId = secondTeachplan.id;
              this.study(teachplanId)
              return;
            }

          }
        }

      })
    },
    mounted() {


      $(function() {
        $('.active-box span').click(function() {
          $(this).css({
            'color': '#00a4ff'
          })
          if ($(this).find('i').hasClass('i-laud')) {
            $(this).find('.i-laud').css('background-position', '-80px -19px')
          } else if ($(this).find('i').hasClass('i-coll')) {
            $(this).find('.i-coll').css('background-position', '1px -75px')
          }
        })
        $('.learing-box .item-list').mouseover(function(e) {
          $(this).css({
            'height': '140px'
          }).addClass('hov').siblings().css({
            'height': '50px'
          })
          $(this).siblings().removeClass('hov')
        })
        $('.learing-box .item-box').mouseout(function() {
          $(this).find('.item-list:first').css({
            'height': '140px'
          }).addClass('hov')
          $(this).find('.item-list:first').siblings().css({
            'height': '50px'
          }).removeClass('hov')
        })
      })


      $(function() {
        $('.learing-box .item-list').mouseover(function(e) {
          $(this).css({
            'height': '140px'
          }).addClass('hov').siblings().css({
            'height': '50px'
          })
          $(this).siblings().removeClass('hov')
        })
        $('.learing-box .item-box').mouseout(function() {
          $(this).find('.item-list:first').css({
            'height': '140px'
          }).addClass('hov')
          $(this).find('.item-list:first').siblings().css({
            'height': '50px'
          }).removeClass('hov')
        })
      })

      $(function() {
        //代码点击显示
        $(".item .item-left").click(function() {
          var pre = $(this).parent();
          if (!pre.find('pre').hasClass('code-pop')) {
            pre.find('pre').addClass('code-pop');
            pre.find('.mask,pre').css('display', 'block')
          } else {
            pre.find('pre').removeClass('code-pop');
            pre.find('.mask,pre').css('display', 'none')
          }
        });
        //代码切换
        $('.content-title p a').click(function() {
          $(this).addClass('all').siblings().removeClass('all');
        })

        $('.learing-box .item-list').mouseover(function(e) {
          $(this).css({
            'height': '140px'
          }).addClass('hov').siblings().css({
            'height': '50px'
          })
          $(this).siblings().removeClass('hov')
        })
        $('.learing-box .item-box').mouseout(function() {
          $(this).find('.item-list:first').css({
            'height': '140px'
          }).addClass('hov')
          $(this).find('.item-list:first').siblings().css({
            'height': '50px'
          }).removeClass('hov')
        })
      })




      $(function() {
        var vidHit = $('html').height() - 0;
        var vidCenHit = (vidHit - $('.video-play').height()) / 2;
        var vdwt = $('.video').width();
        var wt = 300;

        $('.course-cont-top-video,.video').css('height', vidHit);
        $('.video').css('height', vidHit - 50);


        $('.note-cont').css('height', vidHit - $('.note-box .note').height() - 65);

        $(window).resize(function() {
          $('.course-cont-top-video,.video').css('height', vidHit);
          $('.video').css('height', vidHit - 50);
//      $('#video-player').height(vidHit - 70);
          $('.nodte-cont').css('height', vidHit - $('.note-box .note').height() - 65);
        });
        $(window).resize();
        //还原初始状态-控制器
        function setStart(obj) {
          if (obj === 'ck') { //左导航
            setnt()
            setak()
            setcm()
            setnav()
          } else if (obj === 'nt') { //
            setck()
            setak()
            setcm()
            setnav()
          } else if (obj === 'ak') { //
            setck()
            setnt()
            setcm()
            setnav()
          } else if (obj === 'cm') { //
            setck()
            setnt()
            setak()
            setnav()
          } else if (obj === 'nv') { // 目录
            setck()
            setnt()
            setcm()
            setak()
          }
        }

        function setck() {
          if ($('.video-box .glyphicon-align-justify').hasClass('ck')) {
            $('.video-box .glyphicon-align-justify').removeClass('ck');
            $('.video-box').animate({
              width: '100%'
            }, 500)
            $('.course-nav').animate({
              'right': "0px"
            }, 0)
            $('.course-weeklist').animate({
              left: -wt
            }, 500)
          }
        }

        function setnt() {
          if ($('.course-nav .lab-note').hasClass('nt')) {
            $('.course-nav .lab-note').removeClass('nt');
            $('.note').animate({
              'width': "0"
            }, 500);
            $('.course-nav').animate({
              'right': "0px"
            }, 0)
            $('.video').animate({
              'width': '100%'
            }, 500);
          }
        }
        //
        function setnav() {
          if ($('.course-nav .nav').hasClass('nv')) {
            $('.course-nav .nav').removeClass('nv');
            $('.navCont').animate({
              'width': "0"
            }, 500);
            $('.course-nav').animate({
              'right': "0px"
            }, 0)
            $('.video').animate({
              'width': '100%'
            }, 500);
          }
        }
        //
        function setak() {
          if ($('.course-nav .lab-ask').hasClass('ak')) {
            $('.course-nav .lab-ask').removeClass('ak');
            $('.ask').animate({
              'width': "0"
            }, 500);
            $('.course-nav').animate({
              'right': "0px"
            }, 0)
            $('.video').animate({
              'width': '100%'
            }, 500);
          }
        }
        //
        function setcm() {
          if ($('.course-nav .lab-com').hasClass('cm')) {
            $('.course-nav .lab-com').removeClass('cm');
            $('.com').animate({
              'width': "0"
            }, 500);
            $('.course-nav').animate({
              'right': "0px"
            }, 0)
            $('.video').animate({
              'width': '100%'
            }, 500);
          }
        }
        //
        $('.note-box .problem').click(function() {
          alert('wenda')
          if (!$(this).hasClass('ck')) {
            $(this).addClass('ck');
            $(this).find('p').css('display', 'block')
            $('.note-cont').css('height', vidHit - $('.note-box .note').height() - 65);
          } else {
            $(this).removeClass('ck');
            $(this).find('p').css('display', 'none')
            $('.note-cont').css('height', vidHit - $('.note-box .note').height() - 65);
          }
        });
        //
        var reht = $(".video-box .resou-box").height();
        $(".video-box .pull-right").click(function() {
          if (!$(this).hasClass('ck')) {
            $(this).addClass('ck');
            $(".video-box .resources").animate({
              height: reht
            }, 500)
          } else {
            $(this).removeClass('ck');
            $(".video-box .resources").animate({
              height: 0
            }, 500)
          }
        })

        //
        var myNtHt = $('.my-note .textarea-box').height();
        $('.my-note .my-item-box').css('height', $('.note-box').height() - myNtHt - 160 + "px");
        $('.sel-note .my-item-box').css('height', $('.note-box').height() - 160 + "px");
        $('.course-nav .lab-note').click(function() {
          window.location = '#'
          setStart('nt');
          if (!$(this).hasClass('nt')) {
            $(this).addClass('nt');
            $('.note').animate({
              'width': "400px"
            }, 500)
            $('.course-nav').animate({
              'right': "401px"
            }, 500)
            $('.video').animate({
              'width': vdwt - 380 + 'px'
            }, 500);
          } else {
            $(this).removeClass('nt');
            $('.note').animate({
              'width': "0"
            }, 500);
            $('.course-nav').animate({
              'right': "0px"
            }, 500)
            $('.video').animate({
              'width': '100%'
            }, 500);
          }
        })
        //
        $('.course-nav .nav').click(function() {
          window.location = '#'
          setStart('nv');
          if (!$(this).hasClass('nv')) {
            $(this).addClass('nv');
            $('.navCont').animate({
              'width': "300px"
            }, 500)
            $('.course-nav').animate({
              'right': "301px"
            }, 500)
            $('.video').animate({
              'width': vdwt - 280 + 'px'
            }, 500);
          } else {
            $(this).removeClass('nv');
            $('.navCont').animate({
              'width': "0"
            }, 500);
            $('.course-nav').animate({
              'right': "0px"
            }, 500)
            $('.video').animate({
              'width': '100%'
            }, 500);
          }
        })


//    //video播放器
//    $('.video-mine .cls-text').click(function() {
//
//    })

      })

    }
  }

</script>

<style>
  @import './../../../../static/plugins/normalize-css/normalize.css';
  /*@import './../../../../static/plugins/bootstrap/dist/css/bootstrap.css';*/
  @import './../../../../static/css/page-learing-personal.css';
  @import './../../../../static/css/page-learing-course-videoes.css';
  @import './../../../../static/plugins/rainbow.css';
  /*@import './../../../../static/plugins/videojs/video-js.css';*/
  .playbackView {
    position: relative;
  }

  .optionsWrapper {
    width: 500px;
    margin: 20px auto;
  }
  .video-js{
    position:inherit;
  }
  .learing-course{
    background: #000;
  }
  .nav > li > a {
    position: relative;
    display: unset;
    padding: 10px 15px;
/*    color: #ebeef5;*/
  }
/*  .nav > li > a:hover { background-color:#00a4ff; }*/

</style>
