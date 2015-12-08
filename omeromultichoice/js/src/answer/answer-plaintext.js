/**
 * Created by kikkomep on 12/2/15.
 */

define("qtype_omeromultichoice/answer-plaintext",
    [
        'jquery',
        'qtype_omerocommon/moodle-forms-utils',
        'qtype_omerocommon/answer-base',
        'qtype_omerocommon/multilanguage-element',
        'qtype_omerocommon/multilanguage-attoeditor'
    ],
    function ($, Editor, FormUtils) {
        // Private functions.


        // Public functions
        return {
            initialize: function (str) {
                console.log("Initialized", this);

                // defines the basic package
                M.qtypes = M.qtypes || {};

                // defines the specific package of this module
                M.qtypes.omeromultichoice = M.qtypes.omeromultichoice || {};


                /**
                 * Defines MoodleFormUtils class
                 * @type {{}}
                 */
                M.qtypes.omeromultichoice.AnswerPlaintext = function (answer_list_container_id, answer_number, fraction_options) {

                    // the reference to this scope
                    var me = this;

                    // Call the parent constructor
                    M.qtypes.omerocommon.AnswerBase.call(this, answer_list_container_id, answer_number, fraction_options);

                };


                // inherit
                M.qtypes.omerocommon.AnswerPlaintext.prototype = new M.qtypes.omerocommon.AnswerBase();

                // correct the constructor
                M.qtypes.omerocommon.AnswerPlaintext.prototype.constructor = M.qtypes.omerocommon.AnswerPlaintext;
            }
        };
    }
)
;