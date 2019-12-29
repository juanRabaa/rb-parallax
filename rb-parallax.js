//Global comunicator. Methods defined inside RB_Parallax scope
const RB_Parallax_Creator = {};

( function( $ ) {
    var rb_parallax_elements = [];

    // $(window).on('scroll', function() {
    //     $.each(rb_parallax_elements, (index, rb_parallax) => {
    //         requestAnimationFrame(function(){
    //             rb_parallax.updatePosition();
    //         });
    //     });
    // });
    //
    // $(window).resize(function() {
    //     window.requestAnimationFrame(function(){
    //         $.each(rb_parallax_elements, (index, rb_parallax) => { rb_parallax.updatePosition(); });
    //     });
    // });

    function rb_parallax_loop(){
        $.each(rb_parallax_elements, (index, rb_parallax) => {
            rb_parallax.updatePosition();
            rb_parallax.updateValuesIfNecessary();
        });
        requestAnimationFrame(rb_parallax_loop);
    }
    requestAnimationFrame(rb_parallax_loop);

    //Adding methods to the comunicator
    RB_Parallax_Creator.create = function($elem, settings){
        return new RB_Parallax($elem,settings);
    };
    RB_Parallax_Creator.updatePositions = function(){
        $.each(rb_parallax_elements, (index, rb_parallax) => { rb_parallax.updatePosition(); });
    };
    RB_Parallax_Creator.calculateNewValues = function(){
        $.each(rb_parallax_elements, (index, rb_parallax) => { rb_parallax.calculatePositionAndSave(); });
    };
    RB_Parallax_Creator.updateValues = function(){
        $.each(rb_parallax_elements, (index, rb_parallax) => { rb_parallax.updateValuesIfNecessary(true); });
    };

    //Freeze the comunicator to make it unmodifiable
    Object.freeze(RB_Parallax_Creator);

    // =========================================================================
    // RB_Parallax
    // =========================================================================
    //velocity = 1 => fixed | velocity > 1 => faster than scroll | 0 > velocity < 1 => slower than scroll
    class RB_Parallax{
        constructor($elem, settings){
            if(!$elem || !$elem.length)
                return false;

            this.$elem = $elem;
            this.stablishTheSettings(settings);//Settings are overridable by the element attributes
            if(!this.isViableEnvirionment())
                return false;
            this.initialize();
            rb_parallax_elements.push(this);
        }

        isViableEnvirionment(){ return !isMobile() || this.settings['mobile']; }

        getVelocity(){ return this.settings['velocity']; }

        getContainer(){ return this.$container; }

        setContainer(){ this.$container = this.$elem.closest('.rb-parallax-container'); }

        getContainerHeight(){ return this.$container.height(); }

        getY(distToWindowBottom, elemHeight, velocity){
            return parseFloat( ((Math.abs(distToWindowBottom) - elemHeight) * velocity) );
        }

        resetSize(){
            this.$elem.height(this.$container.height());
        }

        //Size to add to avoid gaps due to unexpected problems
        getSecuritySize(){ return this.getContainerHeight() * 0.1; }

        //Calculates the space between the element and the container, based on the container and scroll positions
        calculateGap(){
            var containerHeight = this.getContainerHeight();
            var velocity = this.getVelocity();
            //GAP calculation
            this.currentGap = 0;
            if( velocity > 1 ){//with velocity > 1, gap appears when the scroll meets the container bottom
                this.currentGap = this.getY(window.innerHeight + containerHeight, containerHeight, velocity);
            }
            else //when scroll meets the container top
                this.currentGap = this.getY(window.innerHeight, containerHeight, velocity);
        }

        //Calculates the new element size based on the gap
        setNewSize(){
            var containerHeight = this.getContainerHeight();
            var velocity = this.getVelocity();
            var newHeight = containerHeight;
            this.calculateGap();
            //if(this.$elem.attr('id') == 'preview-parallax-8380') console.log(containerHeight, this.currentGap, this.$elem.height());
            //HEIGHT CALCULATION
            if( this.currentGap > 0 ){
                var newHeight = containerHeight + (this.currentGap);
                if( velocity > 1 )
                    newHeight *= (velocity * velocity);
            }

            newHeight += this.getSecuritySize();
            this.$elem.height(newHeight);
            return containerHeight;
        }

        isInView(){
            let scrollTop = $(window).scrollTop();
            let distToWindowBottom = this.containerOffsetTop - ( scrollTop + window.innerHeight );//Dist from container top to window bottom
            var distToWindowTop = (this.containerOffsetTop + this.calculatedElemHeight) - scrollTop;//Dist from container bottom to window top
            return (distToWindowBottom < this.getSecuritySize()) && (distToWindowTop > -this.getSecuritySize());
        }

        calculatePositionAndSave(){
            var elemHeight = this.getContainerHeight();
            var containerOffsetTop = this.$container.offset().top;
            // var scrollTop = $(window).scrollTop();
            // var distToWindowBottom = containerOffsetTop - ( scrollTop + window.innerHeight );//Dist from container top to window bottom
            // var distToWindowTop = (containerOffsetTop + elemHeight) - scrollTop;//Dist from container bottom to window top
            // var velocity = this.settings['velocity'];
            // var newY = 0;
            // var finalY = 0;
            //Calculates new height for parallax element
            //if(this.$container.height() != this.lastContainerHeight) //this condition causes conflicts with mobile browsers
            elemHeight = this.setNewSize();

            //Element in view (security size should be 0 in a perfect escenario)
            //if((distToWindowBottom < this.getSecuritySize()) && (distToWindowTop > -this.getSecuritySize())){
                // newY = this.getY(0, elemHeight, velocity);
                // finalY = this.getY(window.innerHeight + elemHeight, elemHeight, velocity);
                // if(this.currentGap > 0){
                //     newY -= this.currentGap;
                //     finalY -= this.currentGap;
                // }
            //}

            // newY -= this.getSecuritySize()/2;
            // finalY -= this.getSecuritySize()/2;

            this.calculatedElemHeight = elemHeight;
            this.calculatedWindowHeight = window.innerHeight;
            this.containerOffsetTop = containerOffsetTop;
            // this.calcInitialY = newY;
            // this.calculatedFinalY = finalY;
            // this.calcInitialScroll = containerOffsetTop - window.innerHeight;
            // this.calcFinalScroll = containerOffsetTop + elemHeight;
            this.lastContainerHeight = this.$container.height();
            this.lastContainerWidth = this.$container.width();
            //this.progretionStep = ( this.calculatedFinalY + (-this.calcInitialY) ) / (this.calcFinalScroll - this.calcInitialScroll);
            //this.stepDifference = containerOffsetTop * this.settings['velocity'];
            this.progretionStep = this.settings['velocity'];
            this.stepDifference = containerOffsetTop * this.settings['velocity'];
            //this.lastY = newY;

            //this.$elem.attr('gap', this.currentGap);
            //console.log(/*newY, finalY, this.calcInitialScroll, this.calcFinalScroll, */this.progretionStep/*, this.stepDifference, this.settings['velocity']*/);
        }

        updateValuesIfNecessary(bypass){
            if( bypass ||
                (this.lastContainerHeight != this.$container.height() || this.lastContainerWidth != this.$container.width()) ||
                (this.containerOffsetTop != this.$container.offset().top)
            )
                this.calculatePositionAndSave();
        }

        //Calculates the new position of the elemnt
        getNewPosition(){
            this.lastScrollTop = $(window).scrollTop();
            let newY = this.lastScrollTop * this.progretionStep - this.stepDifference;
            if(this.currentGap > 0)
                newY -= this.currentGap;
            //console.log(newY, step);
            return newY - this.getSecuritySize()/2;
        }

        static validateSetting(settingName, value){
            if(typeof RB_Parallax.settingsSanitation[settingName] == 'function')
                return RB_Parallax.settingsSanitation[settingName](value);
            return value;
        }

        //Returns the default value for a setting
        static getSettingDefault(settingName){
            return RB_Parallax.defaultSettings[settingName] != undefined ? RB_Parallax.defaultSettings[settingName] : null;
        }

        //Returns the settings of an element based of its attributes
        static getElementSettings($elem){
            if(!$elem || !$elem.length)
                return null;

            var settings = {};
            for(let settingName in RB_Parallax.defaultSettings){
                //settings[settingName] = RB_Parallax.getSettingDefault(settingName);
                let elemSettingValue = $elem.attr(`rb-parallax-${settingName}`);
                if(elemSettingValue != undefined)
                    settings[settingName] = RB_Parallax.validateSetting(settingName, elemSettingValue);
            }
            return settings;
        }

        // =====================================================================
        // METHODS
        // =====================================================================
        //Set the settings for the instance
        stablishTheSettings(settings){
            settings = settings != undefined ? settings : {};

            this.settings = Object.assign({}, RB_Parallax.defaultSettings, settings, RB_Parallax.getElementSettings(this.$elem));
            //console.log(this.settings);
        }

        //Change the position of the element to the new one
        updatePosition(){
            if( this.lastScrollTop != $(window).scrollTop() && this.isInView()){
                //console.log('update');
                this.position = this.getNewPosition();
                //console.log('transform', `translate3d(0, ${newPosition}px)`, 0);
                this.$elem.css('transform', `translate3d(0, ${this.position}px, 0)`);
            }
        }

        /**
        *   Wraps the parallax element arround a .rb-parallax-container that fills
        *   its parent, and has overflow hidden.
        */
        wrapElement(){
            if(this.settings['noWrap'])
                return;
            var $holder = $('<div class="rb-parallax-container"></div>');
            this.$elem.wrap($holder);
        }

        //Attach the calculations to the scroll and resize
        // UPDATE: I'm trying to not use this kind of listener anymore
        /* attachEvents(){
            var rbParallax = this;
            $(window).scroll(function(){
                rbParallax.updatePosition();
            });
            $(window).resize(function() {
                rbParallax.updatePosition();
            });
        } */

        loop(){
            var _this = this;
            this.updatePosition();
            requestAnimationFrame(function(){
                _this.loop();
            });
        }

        initialize(){
            this.position = -1;
            this.wrapElement();
            this.setContainer();
            this.calculatePositionAndSave();
            //this.attachEvents();
            //this.loop();
        }

    }
    //Default settings as static property
    RB_Parallax.defaultSettings = {
        velocity: 0.5,
        noWrap: false,
        mobile: true,
    };
    //Settings sanitation functions, for values taken out of an html element
    RB_Parallax.settingsSanitation = {
        velocity: (value) => {return parseFloat(value)},
        noWrap: (value) => {return ((value != undefined) && value); },
        mobile: (value) => {return value != 'false'},
    }

    // =========================================================================
    // Create RB_Parallax instances from .rb-parallax elements
    // =========================================================================
    $(document).ready(function(){
        $('.rb-parallax').each(function(){
            new RB_Parallax($(this));
        });
    });


    // =========================================================================
    // AUX
    // =========================================================================
    function isMobile(){
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
} )( jQuery, RB_Parallax_Creator );