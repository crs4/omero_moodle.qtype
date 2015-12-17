<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Defines the editing form for the omerointeractive question type.
 *
 * @package    qtype
 * @subpackage omerointeractive
 * @copyright  2015 CRS4
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later //FIXME: check the licence
 */


defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/question/type/omerocommon/edit_omerocommon_form.php');

// TODO: just for debug
//require_once($CFG->dirroot . '/question/type/omeromultichoice/edit_omeromultichoice_form.php');

/**
 * omerointeractive question editing form definition.
 *
 * @copyright  2015 CRS4
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later // FIXME: check the licence
 */
//class qtype_omerointeractive_edit_form extends qtype_omerocommon_edit_form
class qtype_omerointeractive_edit_form extends qtype_omerocommon_edit_form
{

    const ADD_ROI_TO_GROUP = "add-to-group-btn";
    const ADD_ROI_GROUP_LIST_OPTIONS = "add-roi-group-list-options";

    public function qtype()
    {
        return 'omerointeractive';
    }

    /**
     * Updates the CSS/JS requirements for this form
     */
    protected function set_form_requirements()
    {
        global $PAGE, $CFG;
        parent::set_form_requirements();
        init_js_modules("omerointeractive");
        $PAGE->requires->css(new moodle_url("$CFG->wwwroot/question/type/omerointeractive/css/question-editor-interactive.css"));
    }

    protected function definition()
    {
        global $CFG, $PAGE;
        parent::definition();

        //--------------------------------------------------------------------------------------------
        //FIXME: just for debugging
        $PAGE->requires->js(new moodle_url("$CFG->wwwroot/repository/omero/viewer/viewer-model.js"));
        //--------------------------------------------------------------------------------------------

        global $PAGE;
        $PAGE->requires->js_call_amd("qtype_omerointeractive/question-editor-interactive", "main",
            array(
                "id_answergroupsheader",
                question_bank::fraction_options_full(),
                self::ADD_ROI_TO_GROUP, self::ADD_ROI_GROUP_LIST_OPTIONS
            )
        );
    }


    protected function define_answer_section_header()
    {
        return array(
            "answergroupsheader",
            get_string('answer_groups', 'qtype_omerointeractive')
        );
    }

    protected function define_answers_section()
    {
        parent::define_answers_section();
        $this->_form->addElement('html', '
        <ul id="roishape-answer-option-ctx-menu" class="dropdown-menu" role="menu" style="display:none" >
            <li class="divider"></li>
            <!--<li><a tabindex="-1" href="javascript:void(0)">Separated link</a></li>-->
            <li>
                <a id="roishape-answer-option-delete" tabindex="-1" href="javascript:void(0)">
                <i class="glyphicon glyphicon-remove-sign"></i>
                Remove</a>
            </li>
        </ul>
        ');
    }


    protected function define_roi_table_inspector()
    {
        $mform = $this->_form;
        $mform->addElement('html', '

                        <div id="omero-image-viewer-toolbar" class="hidden">
                        <div class="checkboxx">
                          <div style="display: inline-block;">
                          <a id="omero-image-properties-update" href="javascript:void(0)" title="Update image center">
                            <i class="glyphicon glyphicon-screenshot"></i>
                          </a>
                          <span id="omero-image-viewer-properties"></span>
                          </div>
                          <div id="omero-image-view-lock-container">
                              <label for="omero-image-view-lock">
                                 lock student navigation:
                              </label>
                              <input id="omero-image-view-lock" name="omero-image-view-lock" data-toggle="toggle"
                                     type="checkbox" data-onstyle="success" data-offstyle="danger">
                          </div>
                        </div>
        ');
        $mform->addElement('html', '</div>');


        $mform->addElement('header', 'roitableinspectorheader',
            get_string('roi_shape_inspector', 'qtype_omeromultichoice'), '');
        $mform->setExpanded('roitableinspectorheader', 1);

        $mform->addElement('html', '
            <div class="fitem" id="roi-shape-inspector-table-container" class="hidden">
                <div class="fitemtitle"><label for="roi-shape-inspector-table"></label></div>
                <div class="felement">

                <!-- TOOLBAR -->
                <div id="roi-shape-inspector-table-toolbar" class="hidden">

                    <!-- Single button -->
                    <div class="btn-group">
                      <button id="' . self::ADD_ROI_TO_GROUP . '"
                              type="button" class="btn btn-info  dropdown-toggle input-small disabled"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Group <span class="caret"></span>
                      </button>
                      <ul id="' . self::ADD_ROI_GROUP_LIST_OPTIONS . '" class="dropdown-menu option input-small " role="menu">
                        <li><a href="#">0</a></li>
                        <li><a href="#">1</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">Add Group</a></li>
                      </ul>
                    </div>
                </div>
                <!-- ROI TABLE -->
                <table id="roi-shape-inspector-table"
                       data-toolbar="#toolbar"
                       data-search="true"
                       data-height="400"
                       data-show-refresh="true"
                       data-show-toggle="true"
                       data-show-columns="true"
                       data-show-export="true"
                       data-detail-view="false"
                       data-minimum-count-columns="2"
                       data-show-pagination-switch="false"
                       data-pagination="false"
                       data-id-field="id"
                       data-page-list="[10, 25, 50, 100, ALL]"
                       data-show-footer="false"
                       data-side-pagination="client">
                </table>
              </div>
            </div>
');
    }


    /**
     * Perform the necessary preprocessing for the fields added by
     * {@link add_per_answer_fields()}.
     * @param object $question the data being passed to the form.
     * @return object $question the modified data.
     */
    protected function data_preprocessing_answers($question, $withanswerfiles = false)
    {
        if (empty($question->options->answers)) {
            return $question;
        }

        $key = 0;
        foreach ($question->options->answers as $answer) {
            // answer content & format
            $question->answer[$key] = ($answer->answer);
            $question->answerformat[$key] = $answer->answerformat;
            // answer fraction
            $question->fraction[$key] = 0 + $answer->fraction;
            unset($this->_form->_defaultValues["fraction[{$key}]"]);
            // answer feedback
            $question->feedback[$key] = ($answer->feedback);
            $question->feedbackformat[$key] = $answer->feedbackformat;

            $question->feedback_locale_map[$key] = json_encode(qtype_omerocommon::serialize_to_json_from($answer->feedback));

            $key++;
        }

        // Now process extra answer fields.
        $extraanswerfields = question_bank::get_qtype($question->qtype)->extra_answer_fields();
        if (is_array($extraanswerfields)) {
            // Omit table name.
            array_shift($extraanswerfields);
            $question = $this->data_preprocessing_extra_answer_fields($question, $extraanswerfields);
        }
        return $question;
    }
}
