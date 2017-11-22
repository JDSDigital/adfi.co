!function(t){"use strict";var e=function(e){var n=t.Deferred(),o=new FileReader;return o.onload=function(t){n.resolve(t.target.result)},o.onerror=n.reject,o.onprogress=n.notify,o.readAsDataURL(e),n.promise()};t.fn.cleanHtml=function(){var e=t(this).html();return e&&e.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/,"")},t.fn.wysiwyg=function(n){var o,a,i,r=this,l=function(){a.activeToolbarClass&&t(a.toolbarSelector).find(i).each(function(){var e=t(this).data(a.commandRole);document.queryCommandState(e)?t(this).addClass(a.activeToolbarClass):t(this).removeClass(a.activeToolbarClass)})},c=function(t,e){var n=t.split(" "),o=n.shift(),a=n.join(" ")+(e||"");document.execCommand(o,0,a),l()},s=function(){var t=window.getSelection();if(t.getRangeAt&&t.rangeCount)return t.getRangeAt(0)},d=function(){o=s()},u=function(){var t=window.getSelection();if(o){try{t.removeAllRanges()}catch(t){document.body.createTextRange().select(),document.selection.empty()}t.addRange(o)}},f=function(n){r.focus(),t.each(n,function(n,o){/^image\//.test(o.type)?t.when(e(o)).done(function(t){c("insertimage",t)}).fail(function(t){a.fileUploadError("file-reader",t)}):a.fileUploadError("unsupported-file-type",o.type)})},m=function(t,e){u(),document.queryCommandSupported("hiliteColor")&&document.execCommand("hiliteColor",0,e||"transparent"),d(),t.data(a.selectionMarker,e)};return a=t.extend({},t.fn.wysiwyg.defaults,n),i="a[data-"+a.commandRole+"],button[data-"+a.commandRole+"],input[type=button][data-"+a.commandRole+"]",function(e){t.each(e,function(t,e){r.keydown(t,function(t){r.attr("contenteditable")&&r.is(":visible")&&(t.preventDefault(),t.stopPropagation(),c(e))}).keyup(t,function(t){r.attr("contenteditable")&&r.is(":visible")&&(t.preventDefault(),t.stopPropagation())})})}(a.hotKeys),a.dragAndDropImages&&function(){r.on("dragenter dragover",!1).on("drop",function(t){var e=t.originalEvent.dataTransfer;t.stopPropagation(),t.preventDefault(),e&&e.files&&e.files.length>0&&f(e.files)})}(),function(e,n){e.find(i).click(function(){u(),r.focus(),c(t(this).data(n.commandRole)),d()}),e.find("[data-toggle=dropdown]").click(u),e.find("input[type=text][data-"+n.commandRole+"]").on("webkitspeechchange change",function(){var e=this.value;this.value="",u(),e&&(r.focus(),c(t(this).data(n.commandRole),e)),d()}).on("focus",function(){var e=t(this);e.data(n.selectionMarker)||(m(e,n.selectionColor),e.focus())}).on("blur",function(){var e=t(this);e.data(n.selectionMarker)&&m(e,!1)}),e.find("input[type=file][data-"+n.commandRole+"]").change(function(){u(),"file"===this.type&&this.files&&this.files.length>0&&f(this.files),d(),this.value=""})}(t(a.toolbarSelector),a),r.attr("contenteditable",!0).on("mouseup keyup mouseout",function(){d(),l()}),t(window).bind("touchend",function(t){var e=r.is(t.target)||r.has(t.target).length>0,n=s();n&&n.startContainer===n.endContainer&&n.startOffset===n.endOffset&&!e||(d(),l())}),this},t.fn.wysiwyg.defaults={hotKeys:{"ctrl+b meta+b":"bold","ctrl+i meta+i":"italic","ctrl+u meta+u":"underline","ctrl+z meta+z":"undo","ctrl+y meta+y meta+shift+z":"redo","ctrl+l meta+l":"justifyleft","ctrl+r meta+r":"justifyright","ctrl+e meta+e":"justifycenter","ctrl+j meta+j":"justifyfull","shift+tab":"outdent",tab:"indent"},toolbarSelector:"[data-role=editor-toolbar]",commandRole:"edit",activeToolbarClass:"btn-info",selectionMarker:"edit-focus-marker",selectionColor:"darkgrey",dragAndDropImages:!0,fileUploadError:function(t,e){console.log("File upload error",t,e)}}}(window.jQuery);