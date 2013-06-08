var leftNavBlock = new FloatBlock({
	block: '#floatNavBlock',
	position: 'left',
	topLimitBlock: '[data-floatBlock="topLimit"]',
	bottomLimitBlock: '[data-floatBlock="bottomLimit"]',
	aligningBlock: '[data-floatBlock="topLimit"]'
});

var FloatBlock = (function($, global){
    var defaultOptions = {},
        init,
        bindEvents,
        global = $(global),
        windowScrollTop,
        windowHeight = 0,
        updateDimensions,
        checkState,
        module;

    init = function(options) {
        this.options = $.extend({}, defaultOptions, options);
        this.block = $(options.block);
        this.blockHeight = this.block.outerHeight();
        this.topLimitBlock = $(options.topLimitBlock);
        this.bottomLimitBlock = $(options.bottomLimitBlock);
        this.aligningBlock = $(options.aligningBlock);
        this.block.appendTo('body');

        updateDimensions.call(this);
        checkState.call(this);
        bindEvents.call(this);
    };
    bindEvents = function() {
        var checkTimer = 0;
        global.on('resize.floatBlock', $.proxy(function(){
            clearTimeout(checkTimer);
            checkTimer = setTimeout($.proxy(function(){
                updateDimensions.call(this);
                checkState.call(this);
            }, this), 100);
        }, this));

        global.on('scroll.floatBlock', $.proxy(function(){
            updateDimensions.call(this);
            checkState.call(this);
        }, this));
    };
    updateDimensions = function(){
        this.topLimitPoint = this.topLimitBlock.offset().top + this.topLimitBlock.outerHeight();
        this.bottomLimitPoint = this.bottomLimitBlock.offset().top;
        this.left = (global.scrollLeft() - this.aligningBlock.offset().left) * - 1;
        windowScrollTop = global.scrollTop();
        windowHeight = global.height();
    };
    checkState = function() {
        if (windowScrollTop + this.blockHeight >= this.bottomLimitPoint) {
            this.currentState = 'top';
            this.block.css({
                position: 'absolute',
                top: this.bottomLimitPoint - this.blockHeight,
                left: this.aligningBlock.offset().left
            });
            return;
        } else if (windowScrollTop >= this.topLimitPoint) {
            this.currentState = 'float';
            this.block.css({
                position: 'fixed',
                top: 0,
                left: this.left
            });
            return;
        } else {
            this.currentState = 'bottom';
            this.block.css({
                position: 'absolute',
                top: this.topLimitPoint,
                left: this.aligningBlock.offset().left
            });
        }
    };
    module = function() {
        init.apply(this, arguments);
    };

    return module;
})(jQuery, window);