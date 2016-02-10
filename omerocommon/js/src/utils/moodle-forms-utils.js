// Copyright (c) 2015-2016, CRS4
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * Moodle form utils.
 *
 * @package    qtype
 * @subpackage omerocommon
 * @copyright  2015-2016 CRS4
 * @license    https://opensource.org/licenses/mit-license.php MIT license
 */
define("qtype_omerocommon/moodle-forms-utils",
    ['jquery'],
    function (j) {
        // Private functions.
        var $ = jQuery;


        // Public functions
        return {
            initialize: function (str) {

                // defines the basic package
                M.qtypes = M.qtypes || {};

                // defines the specific package of this module
                M.qtypes.omerocommon = M.qtypes.omerocommon || {};


                /**
                 * Defines MoodleFormUtils class
                 * @type {{}}
                 */
                M.qtypes.omerocommon.MoodleFormUtils = function () {

                    var me = this;

                    // the list elements added by this utility class
                    me._dynamic_elements = {};

                };

                // reference to the prototype
                var prototype = M.qtypes.omerocommon.MoodleFormUtils.prototype;

                // reference to the 'class'
                var formUtilsClass = M.qtypes.omerocommon.MoodleFormUtils;

                /**
                 * Dynamically appends a new element to a given element
                 * identified by its id, assigning a label to it.
                 *
                 * @param container_id
                 * @param label the label to assign to the element
                 * @param element html || jQuery element
                 */
                prototype.appendElementByContainerId = function (container_id,
                                                                 label, element) {
                    var me = this;
                    var element_obj = $(element);
                    var existingContainer = $("#" + editor_container_id + " div.fcontainer");

                    // Checks whether the fieldset exists or not
                    if (!editor_container_id.length) {
                        console.error("FieldSet " + editor_container_id + " not found!!!");
                    }

                    // checks the existing id (or generates it)
                    if (!(element_obj.attr("id")))
                        element_obj.attr("id", formUtilsClass.generateGuid());

                    // builds the root element to append to the fieldset
                    var newContainerId = formUtilsClass.generateGuid();
                    var newContainer = $('<div class="fitem" id="' + newContainerId + '"></div>');

                    // sets the id of the wrapped element
                    newContainer.attr("container-of", element_obj.attr("id"));

                    // appends inner content
                    newContainer.html([
                        '<div class="fitemtitle"><label for="' + element_obj.attr("id") + '">' + label + '</label></div>',
                        '<div class="felement">',
                        '<div>',
                        element_obj.get(0).outerHTML,
                        '</div>',
                        '</div>'
                    ].join(" "));

                    // appends the element
                    existingContainer.append(newContainer);
                    // updates the list elements generated by this utility instance
                    me._dynamic_elements[element_obj.attr("id")] = newContainer;

                    // returns the element created
                    return newContainer;
                };


                prototype.appendElement = function (container,
                                                    label, element, append_loacale_map_name) {
                    var me = this;
                    var element_obj = $(element);
                    var elementContainer = $(container);

                    // checks the existing id (or generates it)
                    if (!(elementContainer.attr("id")))
                        elementContainer.attr("id", formUtilsClass.generateGuid());

                    // checks the existing id (or generates it)
                    if (!(element_obj.attr("id")))
                        element_obj.attr("id", formUtilsClass.generateGuid());

                    // builds the root element to append to the fieldset
                    var newContainerId = formUtilsClass.generateGuid();
                    var newContainer = $('<div class="fitem" id="' + newContainerId + '"></div>');

                    // sets the id of the wrapped element
                    newContainer.attr("container-of", element_obj.attr("id"));

                    // appends inner content
                    newContainer.html([
                        '<div class="fitemtitle"><label for="' + element_obj.attr("id") + '">' + label + '</label></div>',
                        '<div class="felement">',
                        '<div>',
                        element_obj.get(0).outerHTML,
                        ((append_loacale_map_name && append_loacale_map_name.length > 0)
                            ? '<input type="hidden" name="' + append_loacale_map_name + '" value="{}" />'
                            : ""),
                        '</div>',
                        '</div>'
                    ].join(" "));

                    // appends the element
                    elementContainer.append(newContainer);
                    // updates the list elements generated by this utility instance
                    me._dynamic_elements[element_obj.attr("id")] = newContainer;

                    // returns the element created
                    return newContainer;
                };


                /**
                 * Removes the an element previously added to a fieldset using this utility class
                 *
                 * @param fieldset_container_id
                 * @param element_id
                 */
                prototype.removeElementFromFieldSet = function (element_id) {
                    var me = this;
                    var el = $("#" + element_id);

                    if (!el.length) {
                        console.error("Element " + element_id + " doesn't exist");
                        return false;
                    }

                    el.parent().parent().remove();

                    // Removes the elements from the list of added elements
                    // when the 'remove' event occurs
                    delete me._dynamic_elements[element_id];
                    return true;
                };


                /**
                 * Generate a UUID to identify HTML elements
                 *
                 * @returns {string}
                 * @private
                 */
                formUtilsClass.generateGuid = function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                };

                /**
                 * Initialize the dropdown menu
                 */
                formUtilsClass.initDropdown = function () {
                    var dropdown = $(".dropdown-toggle");
                    if (dropdown.length)
                        dropdown.dropdown();
                };


                /**
                 * Initialize
                 */
                formUtilsClass.iniPopupOver = function () {
                    var popover = $('[data-toggle="popover"]');
                    if (popover.length > 0) {
                        popover.popover();
                    }
                };


                formUtilsClass.initModelPanels = function (modal_panel_id) {

                    $('#' + modal_panel_id).modal();

                    //$('#myInput').focus();


                    //$("#enableModal").click(function () {
                    //    $('#myModal').modal();
                    //    //$('#myInput').focus();
                    //});


                    //$('#username').editable({
                    //
                    //    success: function (response, newValue) {
                    //        alert("Changed: !!!");
                    //    }
                    //});
                };


                formUtilsClass.appendHiddenElement = function (container, element) {
                    try {

                        var element_obj = $(element);
                        var elementContainer = $(container);

                        // checks the existing id (or generates it)
                        if (!(elementContainer.attr("id")))
                            elementContainer.attr("id", formUtilsClass.generateGuid());

                        // checks the existing id (or generates it)
                        if (!(element_obj.attr("id")))
                            element_obj.attr("id", formUtilsClass.generateGuid());

                        elementContainer.append(element_obj);

                    } catch (e) {
                        console.error(e);
                    }
                };

                formUtilsClass.htmlentities = function (string, quote_style, charset, double_encode) {
                    //  discuss at: http://phpjs.org/functions/htmlentities/
                    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    // improved by: nobbler
                    // improved by: Jack
                    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
                    // improved by: Dj (http://phpjs.org/functions/htmlentities:425#comment_134018)
                    // bugfixed by: Onno Marsman
                    // bugfixed by: Brett Zamir (http://brett-zamir.me)
                    //    input by: Ratheous
                    //  depends on: get_html_translation_table
                    //        note: function is compatible with PHP 5.2 and older
                    //   example 1: htmlentities('Kevin & van Zonneveld');
                    //   returns 1: 'Kevin &amp; van Zonneveld'
                    //   example 2: htmlentities("foo'bar","ENT_QUOTES");
                    //   returns 2: 'foo&#039;bar'

                    var hash_map = formUtilsClass.getHtmlTranslationTable('HTML_ENTITIES', quote_style),
                        symbol = '';

                    string = string == null ? '' : string + '';

                    if (!hash_map) {
                        return false;
                    }

                    if (quote_style && quote_style === 'ENT_QUOTES') {
                        hash_map["'"] = '&#039;';
                    }

                    double_encode = double_encode == null || !!double_encode;

                    var regex = new RegExp("&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[" +
                        Object.keys(hash_map)
                            .join("")
                            // replace regexp special chars
                            .replace(/([()[\]{}\-.*+?^$|\/\\])/g, "\\$1") + "]",
                        "g");

                    return string.replace(regex, function (ent) {
                        if (ent.length > 1) {
                            return double_encode ? hash_map["&"] + ent.substr(1) : ent;
                        }

                        return hash_map[ent];
                    });
                };

                formUtilsClass.htmlspecialchars = function (string, quote_style, charset, double_encode) {
                    //       discuss at: http://phpjs.org/functions/htmlspecialchars/
                    //      original by: Mirek Slugen
                    //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    //      bugfixed by: Nathan
                    //      bugfixed by: Arno
                    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
                    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
                    //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    //         input by: Ratheous
                    //         input by: Mailfaker (http://www.weedem.fr/)
                    //         input by: felix
                    // reimplemented by: Brett Zamir (http://brett-zamir.me)
                    //             note: charset argument not supported
                    //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
                    //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
                    //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
                    //        returns 2: 'ab"c&#039;d'
                    //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false);
                    //        returns 3: 'my &quot;&entity;&quot; is still here'

                    var optTemp = 0,
                        i = 0,
                        noquotes = false;
                    if (typeof quote_style === 'undefined' || quote_style === null) {
                        quote_style = 2;
                    }
                    string = string || '';
                    string = string.toString();
                    if (double_encode !== false) {
                        // Put this first to avoid double-encoding
                        string = string.replace(/&/g, '&amp;');
                    }
                    string = string.replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');

                    var OPTS = {
                        'ENT_NOQUOTES': 0,
                        'ENT_HTML_QUOTE_SINGLE': 1,
                        'ENT_HTML_QUOTE_DOUBLE': 2,
                        'ENT_COMPAT': 2,
                        'ENT_QUOTES': 3,
                        'ENT_IGNORE': 4
                    };
                    if (quote_style === 0) {
                        noquotes = true;
                    }
                    if (typeof quote_style !== 'number') {
                        // Allow for a single string or an array of string flags
                        quote_style = [].concat(quote_style);
                        for (i = 0; i < quote_style.length; i++) {
                            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
                            if (OPTS[quote_style[i]] === 0) {
                                noquotes = true;
                            } else if (OPTS[quote_style[i]]) {
                                optTemp = optTemp | OPTS[quote_style[i]];
                            }
                        }
                        quote_style = optTemp;
                    }
                    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
                        string = string.replace(/'/g, '&#039;');
                    }
                    if (!noquotes) {
                        string = string.replace(/"/g, '&quot;');
                    }

                    return string;
                };


                formUtilsClass.htmlEntityDecode = function (string, quote_style) {
                    //  discuss at: http://phpjs.org/functions/get_html_translation_table/
                    // original by: Philip Peterson
                    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    // bugfixed by: noname
                    // bugfixed by: Alex
                    // bugfixed by: Marco
                    // bugfixed by: madipta
                    // bugfixed by: Brett Zamir (http://brett-zamir.me)
                    // bugfixed by: T.Wild
                    // improved by: KELAN
                    // improved by: Brett Zamir (http://brett-zamir.me)
                    //    input by: Frank Forte
                    //    input by: Ratheous
                    //        note: It has been decided that we're not going to add global
                    //        note: dependencies to php.js, meaning the constants are not
                    //        note: real constants, but strings instead. Integers are also supported if someone
                    //        note: chooses to create the constants themselves.
                    //   example 1: get_html_translation_table('HTML_SPECIALCHARS');
                    //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

                    var hash_map = {},
                        symbol = '',
                        tmp_str = '',
                        entity = '';
                    tmp_str = string.toString();

                    if (false === (hash_map = formUtilsClass.getHtmlTranslationTable('HTML_ENTITIES', quote_style))) {
                        return false;
                    }

                    // fix &amp; problem
                    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
                    delete(hash_map['&']);
                    hash_map['&'] = '&amp;';

                    for (symbol in hash_map) {
                        entity = hash_map[symbol];
                        tmp_str = tmp_str.split(entity)
                            .join(symbol);
                    }
                    tmp_str = tmp_str.split('&#039;')
                        .join("'");

                    return tmp_str;
                };


                formUtilsClass.getHtmlTranslationTable = function (table, quote_style) {
                    //  discuss at: http://phpjs.org/functions/get_html_translation_table/
                    // original by: Philip Peterson
                    //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                    // bugfixed by: noname
                    // bugfixed by: Alex
                    // bugfixed by: Marco
                    // bugfixed by: madipta
                    // bugfixed by: Brett Zamir (http://brett-zamir.me)
                    // bugfixed by: T.Wild
                    // improved by: KELAN
                    // improved by: Brett Zamir (http://brett-zamir.me)
                    //    input by: Frank Forte
                    //    input by: Ratheous
                    //        note: It has been decided that we're not going to add global
                    //        note: dependencies to php.js, meaning the constants are not
                    //        note: real constants, but strings instead. Integers are also supported if someone
                    //        note: chooses to create the constants themselves.
                    //   example 1: get_html_translation_table('HTML_SPECIALCHARS');
                    //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

                    var entities = {},
                        hash_map = {},
                        decimal;
                    var constMappingTable = {},
                        constMappingQuoteStyle = {};
                    var useTable = {},
                        useQuoteStyle = {};

                    // Translate arguments
                    constMappingTable[0] = 'HTML_SPECIALCHARS';
                    constMappingTable[1] = 'HTML_ENTITIES';
                    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
                    constMappingQuoteStyle[2] = 'ENT_COMPAT';
                    constMappingQuoteStyle[3] = 'ENT_QUOTES';

                    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
                    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() :
                        'ENT_COMPAT';

                    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
                        throw new Error('Table: ' + useTable + ' not supported');
                        // return false;
                    }

                    entities['38'] = '&amp;';
                    if (useTable === 'HTML_ENTITIES') {
                        entities['160'] = '&nbsp;';
                        entities['161'] = '&iexcl;';
                        entities['162'] = '&cent;';
                        entities['163'] = '&pound;';
                        entities['164'] = '&curren;';
                        entities['165'] = '&yen;';
                        entities['166'] = '&brvbar;';
                        entities['167'] = '&sect;';
                        entities['168'] = '&uml;';
                        entities['169'] = '&copy;';
                        entities['170'] = '&ordf;';
                        entities['171'] = '&laquo;';
                        entities['172'] = '&not;';
                        entities['173'] = '&shy;';
                        entities['174'] = '&reg;';
                        entities['175'] = '&macr;';
                        entities['176'] = '&deg;';
                        entities['177'] = '&plusmn;';
                        entities['178'] = '&sup2;';
                        entities['179'] = '&sup3;';
                        entities['180'] = '&acute;';
                        entities['181'] = '&micro;';
                        entities['182'] = '&para;';
                        entities['183'] = '&middot;';
                        entities['184'] = '&cedil;';
                        entities['185'] = '&sup1;';
                        entities['186'] = '&ordm;';
                        entities['187'] = '&raquo;';
                        entities['188'] = '&frac14;';
                        entities['189'] = '&frac12;';
                        entities['190'] = '&frac34;';
                        entities['191'] = '&iquest;';
                        entities['192'] = '&Agrave;';
                        entities['193'] = '&Aacute;';
                        entities['194'] = '&Acirc;';
                        entities['195'] = '&Atilde;';
                        entities['196'] = '&Auml;';
                        entities['197'] = '&Aring;';
                        entities['198'] = '&AElig;';
                        entities['199'] = '&Ccedil;';
                        entities['200'] = '&Egrave;';
                        entities['201'] = '&Eacute;';
                        entities['202'] = '&Ecirc;';
                        entities['203'] = '&Euml;';
                        entities['204'] = '&Igrave;';
                        entities['205'] = '&Iacute;';
                        entities['206'] = '&Icirc;';
                        entities['207'] = '&Iuml;';
                        entities['208'] = '&ETH;';
                        entities['209'] = '&Ntilde;';
                        entities['210'] = '&Ograve;';
                        entities['211'] = '&Oacute;';
                        entities['212'] = '&Ocirc;';
                        entities['213'] = '&Otilde;';
                        entities['214'] = '&Ouml;';
                        entities['215'] = '&times;';
                        entities['216'] = '&Oslash;';
                        entities['217'] = '&Ugrave;';
                        entities['218'] = '&Uacute;';
                        entities['219'] = '&Ucirc;';
                        entities['220'] = '&Uuml;';
                        entities['221'] = '&Yacute;';
                        entities['222'] = '&THORN;';
                        entities['223'] = '&szlig;';
                        entities['224'] = '&agrave;';
                        entities['225'] = '&aacute;';
                        entities['226'] = '&acirc;';
                        entities['227'] = '&atilde;';
                        entities['228'] = '&auml;';
                        entities['229'] = '&aring;';
                        entities['230'] = '&aelig;';
                        entities['231'] = '&ccedil;';
                        entities['232'] = '&egrave;';
                        entities['233'] = '&eacute;';
                        entities['234'] = '&ecirc;';
                        entities['235'] = '&euml;';
                        entities['236'] = '&igrave;';
                        entities['237'] = '&iacute;';
                        entities['238'] = '&icirc;';
                        entities['239'] = '&iuml;';
                        entities['240'] = '&eth;';
                        entities['241'] = '&ntilde;';
                        entities['242'] = '&ograve;';
                        entities['243'] = '&oacute;';
                        entities['244'] = '&ocirc;';
                        entities['245'] = '&otilde;';
                        entities['246'] = '&ouml;';
                        entities['247'] = '&divide;';
                        entities['248'] = '&oslash;';
                        entities['249'] = '&ugrave;';
                        entities['250'] = '&uacute;';
                        entities['251'] = '&ucirc;';
                        entities['252'] = '&uuml;';
                        entities['253'] = '&yacute;';
                        entities['254'] = '&thorn;';
                        entities['255'] = '&yuml;';
                    }

                    if (useQuoteStyle !== 'ENT_NOQUOTES') {
                        entities['34'] = '&quot;';
                    }
                    if (useQuoteStyle === 'ENT_QUOTES') {
                        entities['39'] = '&#39;';
                    }
                    entities['60'] = '&lt;';
                    entities['62'] = '&gt;';

                    // ascii decimals to real symbols
                    for (decimal in entities) {
                        if (entities.hasOwnProperty(decimal)) {
                            hash_map[String.fromCharCode(decimal)] = entities[decimal];
                        }
                    }

                    return hash_map;
                };
            }
        };
    }
);