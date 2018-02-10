/* 
 * targetClass -> table selector (adds sticky headers only to selected tables)
 * cssClass -> custom css class to style sticky
 * appendScrollTop -> adds 'scroll-top' button (scrolls to the top of the table which sticky belongs to)
 */
function injectStickyTheaders(opts) {

    var DEFAULT_CSS = 'header-sticky',
        DEFAULT_TARGET_CLASS= 'table-sticky-header',
        tables = [];

    opts.targetClass = opts.targetClass || DEFAULT_TARGET_CLASS;

    function Table(table, sticky) {
        this.table = table;
        this.sticky = sticky;
        this.customSticky = (opts.cssClass !== undefined);
    }

    function CreateSticky(table) {
        var original = table.firstElementChild;
        var sticky = original.cloneNode(true); // thead
        sticky.classList.add(opts.cssClass || DEFAULT_CSS);

        if (opts.appendScrollTop) { // adding scroll top to each thead:
            var div = document.createElement('div');
            div.classList.add('header-up');
            div.addEventListener('click', function() {
                window.scrollBy(0, original.getBoundingClientRect().top);
            }, true);
            sticky.appendChild(div);
        }
        
        return sticky;
    }

    function UpdateStickies() {
        tables.forEach(function(e) {
            var originalThead = e.table.firstElementChild;
            var originalThs = originalThead.firstElementChild.children; // original th collection
            var stickyThs = e.sticky.firstElementChild.children; // sticky th collection
            
            Array.prototype.forEach.call(originalThs, function (e, i) {
                stickyThs[i].innerText = e.innerText;
                stickyThs[i].style.cssText = 'width: ' + e.offsetWidth + 'px;';
            });

            if (!e.customSticky)
                e.sticky.style.cssText = 'background-color: ' + document.defaultView.getComputedStyle(originalThead, null)['backgroundColor'];
        });
    }

    function InjectDefaultCssClass() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.header-sticky { position: fixed; top: 0; z-index: 100; display: none; box-shadow: 0 3px 3px -3px silver; animation: show .2s ease-in-out; }';
        document.head.appendChild(style);
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.header-up { position: absolute; width: 0; height: 0; top: calc(49% - .75em); right: 1em; opacity: .75; cursor: pointer; border-left: .75em solid transparent; border-right: .75em solid transparent; border-bottom: 1.25em solid #999; } .header-up:hover { opacity: 1; transform: scale(1.05, 1.05);}';
        document.head.appendChild(style);

        var show = document.createElement('style');
        show.innerHTML = '\
        @keyframes show {\
            0% {\
                opacity: 0;\
                top: -1em;\
            }\
            100% {\
                opacity: 1;\
                top: 0;\
            }}';
        document.head.appendChild(show);
    }
    
    // fill array with table references
    Array.prototype.forEach.call(document.getElementsByClassName(opts.targetClass), function(e) {
        tables.push(new Table(e, CreateSticky(e)));
    });

    
    // handle scroll/resize
    window.addEventListener('scroll', function() {
        tables.forEach(function(e) {
            var tdHeight = e.table.getElementsByTagName('td')[0].offsetHeight; // to remove sticky just before last row
            var tableH = e.table.getBoundingClientRect();
            var elem = e.table.firstElementChild.getBoundingClientRect();
            (elem.top < 0 && tableH.bottom - tdHeight/2 > 0) ? e.sticky.style.display = 'block' : e.sticky.style.display = 'none';
        });
    }, true);
    window.addEventListener('resize', function() {
        UpdateStickies();
    }, true);

    //init stickies
    (function () {
        InjectDefaultCssClass();
        tables.forEach(function (e) {
            e.table.appendChild(e.sticky);
            UpdateStickies();
        });
    })();
}
