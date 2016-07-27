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
 * Simple wrapper of the default browser logger.
 *
 * @package    qtype
 * @subpackage omerocommon
 * @copyright  2015-2016 CRS4
 * @license    https://opensource.org/licenses/mit-license.php MIT license
 */
define(['qtype_omerocommon/image-viewer'],
    /* jshint curly: false */
    /* globals $ */
    function (ImageViewer) {

        // debug_mode
        //var debug_mode = M.cfg.developerdebug;

        // defines the basic package
        M.qtypes = M.qtypes || {};

        // defines the specific package of this module
        M.qtypes.omerocommon = M.qtypes.omerocommon || {};

        // the logger instance
        M.qtypes.omerocommon.logger = {};


        M.qtypes.omerocommon.ModalImagePanel = function (modal_image_selector_panel_id) {
            this._modal_image_selector_id = modal_image_selector_panel_id;

            // FIXME: the id of the image container must be configurable
            this._image_info_container = $("#modalImageDialogPanel-image-viewer-container");
            this._image_info_container_template = $("#modalImageDialogPanel-image-viewer-container").html();

            // init properties to host the list of visible/focusable rois
            this._visible_roi_list = [];
            this._focusable_roi_list = [];
        };


        var prototype = M.qtypes.omerocommon.ModalImagePanel.prototype;

        prototype.show = function (image_id, visible_rois, focusable_rois) {

            $("#" + this._modal_image_selector_id).modal("show");

            var me = this;

            me._visible_roi_list = visible_rois ? visible_rois.split(",") : [];
            me._focusable_roi_list = focusable_rois ? focusable_rois.split(",") : [];

            // clean the old canvas
            me._image_info_container.html(me._image_info_container_template);

            var viewer_ctrl = new ImageViewer(
                image_id, undefined,
                me._image_server || "http://ome-cytest.crs4.it:8080",
                "modalImageDialogPanel-image-viewer-container", "modalImageDialogPanel-annotations_canvas",
                me._viewer_model_server || "http://mep.crs4.it/moodle/question/type/omerocommon/viewer/viewer-model.php");
            me._image_viewer_controller = viewer_ctrl;

            // load and show image and its related ROIs
            viewer_ctrl.open(true, function (data) {
                me.onImageModelRoiLoaded(data);
                //me._initImagePropertiesControls();
                me._image_viewer_controller.updateViewFromProperties(me._image_properties);
                //$("#omero-image-viewer-toolbar").removeClass("hidden");
            });
        };


        prototype._hide = function () {
            $("#" + this._modal_image_selector_id).modal("hide");
        };


        M.qtypes.omerocommon.ModalImagePanel.DEFAULT_ELEMENT_NAME = "modalImageDialogPanel";
        M.qtypes.omerocommon.ModalImagePanel.getInstance = function () {
            if (!M.qtypes.omerocommon.ModalImagePanel._default_instance) {
                M.qtypes.omerocommon.ModalImagePanel._default_instance =
                    new M.qtypes.omerocommon.ModalImagePanel(M.qtypes.omerocommon.ModalImagePanel.DEFAULT_ELEMENT_NAME);
            }
            return M.qtypes.omerocommon.ModalImagePanel._default_instance;
        };

        // returns the class
        return M.qtypes.omerocommon.ModalImagePanel;
    }
);