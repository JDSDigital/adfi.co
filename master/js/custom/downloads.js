var DateFunc = function () {
	return {
		getDate: function (date) {
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();

			// After this construct a string with the above results as below
			return year + "-" + month + "-" + day + " " + hour + ':' + minute + ':' + second;
		}
	};
}();

var Select = function () {
	return {
		//main function to initiate the module
		init: function () {
			// Set the "bootstrap" theme as the default theme for all Select2
			// widgets.
			//
			// @see https://github.com/select2/select2/issues/2927
			$.fn.select2.defaults.set("theme", "bootstrap");

			var placeholder = "Seleccionar";

			$(".select2, .select2-multiple").select2({
				placeholder: placeholder,
				width: null
			});

			$(".select2-allow-clear").select2({
				allowClear: true,
				placeholder: placeholder,
				width: null
			});

			// @see https://select2.github.io/examples.html#data-ajax
			function formatRepo(repo) {
				if (repo.loading) return repo.text;

				var markup = "<div class='select2-result-repository clearfix'>" +
                    "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
                    "<div class='select2-result-repository__meta'>" +
                    "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

				if (repo.description) {
					markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
				}

				markup += "<div class='select2-result-repository__statistics'>" +
                    "<div class='select2-result-repository__forks'><span class='glyphicon glyphicon-flash'></span> " + repo.forks_count + " Forks</div>" +
                    "<div class='select2-result-repository__stargazers'><span class='glyphicon glyphicon-star'></span> " + repo.stargazers_count + " Stars</div>" +
                    "<div class='select2-result-repository__watchers'><span class='glyphicon glyphicon-eye-open'></span> " + repo.watchers_count + " Watchers</div>" +
                    "</div>" +
                    "</div></div>";

				return markup;
			}

			function formatRepoSelection(repo) {
				return repo.full_name || repo.text;
			}

			$("button[data-select2-open]").click(function () {
				$("#" + $(this).data("select2-open")).select2("open");
			});

			// copy Bootstrap validation states to Select2 dropdown
			//
			// add .has-waring, .has-error, .has-succes to the Select2 dropdown
			// (was #select2-drop in Select2 v3.x, in Select2 v4 can be selected via
			// body > .select2-container) if _any_ of the opened Select2's parents
			// has one of these forementioned classes (YUCK! ;-))
			$(".select2, .select2-multiple, .select2-allow-clear, .js-data-example-ajax").on("select2:open", function () {
				if ($(this).parents("[class*='has-']").length) {
					var classNames = $(this).parents("[class*='has-']")[0].className.split(/\s+/);

					for (var i = 0; i < classNames.length; ++i) {
						if (classNames[i].match("has-")) {
							$("body > .select2-container").addClass(classNames[i]);
						}
					}
				}
			});

			$(".js-btn-set-scaling-classes").on("click", function () {
				$("#select2-multiple-input-sm, #select2-single-input-sm").next(".select2-container--bootstrap").addClass("input-sm");
				$("#select2-multiple-input-lg, #select2-single-input-lg").next(".select2-container--bootstrap").addClass("input-lg");
				$(this).removeClass("btn-primary btn-outline").prop("disabled", true);
			});
		}
	};
}();

jQuery(document).ready(function () {

	Select.init();
	ComponentsDateTimePickers.init();

	function GenerateReport(target) {
	    $("#pnlMessage").hide();
	    var routerIds = [];
	    var downloadName = $("#ddlDownload :selected").text();
	    var whiteLabelId = $('#ddlWhiteLabel :selected').val();
	    var fromDate = $("#rtpDownload").data('daterangepicker').startDate._d;
	    var toDate = $("#rtpDownload").data('daterangepicker').endDate._d;
	    var form = $("#downloadsForm");

	    if (downloadName.length == 0) {
	        $("#pnlMessage").append("<strong>Formulario incompleto!</strong> Por favor selecciona un reporte.");
	        $("#pnlMessage").show();

	        return;
	    }

	    var routerIds = $("#routerList li input:checked:not([disabled])").map(function () { return this.value; }).get();

	    if (routerIds.length == 0) {
	        $("#pnlMessage").append("<strong>Formulario incompleto!</strong> Por favor selecciona un hotspot.");
	        $("#pnlMessage").show();

	        return;
	    }

	    $("#downloadName").val(downloadName);
	    $("#whiteLabelId").val(whiteLabelId);
	    $("#routerIds").val(routerIds.join(", "));
	    $("#fromDate").val(DateFunc.getDate(fromDate));
	    $("#toDate").val(DateFunc.getDate(toDate));
	    $("#btnDownload").hide();
	    $("#btnViewPdf").hide();
        $("#spnDownload").show();
	    

	    $.ajax({
	        type: "Post",
	        cache: false,
	        url: '/Downloads/GenerateReport',
	        data: $("#downloadsForm").serialize(),
	    }).done(function (data) {
	        var response = data;
	        switch (response.ContentLength) {
	            case -1:
	                $("#pnlMessage").text('Error al generar el reporte seleccionado. Contacte al administrador');
	                $("#pnlMessage").show();
	                break;
	            case 0:
	                $("#pnlMessage").text('No hay datos de el/los hotspots seleccionados');
	                $("#pnlMessage").show();
	                break;
	            default:
	                if (target == "download") {
                        window.open('/Downloads/Download?fileGuid=' + response.FileGuid
                                + '&fileName=' + response.FileName
                                + '&contentType=' + response.ContentType, '_blank');
	                } else {
	                     document.getElementById('iFrameDocs').src = '/Downloads/ViewPDF?fileGuid=' + response.FileGuid
                                + '&fileName=' + response.FileName
                                + '&contentType=' + response.ContentType;
	                    $("#iFrameDiv").show();
	                }
	        }

	        $("#btnDownload").show();
	        $("#btnViewPdf").show();
	        $("#spnDownload").hide();
	    }).fail(function (jqXHR, textStatus, errorThrown) {
	        $("#pnlMessage").show();
	    });

	}

	$("#btnDownload").click(function () {
	    GenerateReport("download");
	});

	$("#btnViewPdf").click(function () {
	    GenerateReport("view");
	});

	$("#btnSubscribe").click(function () {
		$("#pnlMessage").hide();
		var routerIds = [];
		var downloadName;
		var period;
		var frecuency = 7;
		var form = $("#subscriptionForm");
		var email = $("#Email").val();
		
		downloadName = $("#ddlDownloadNameSubscribe :selected").text();
		frecuency = $("#ddlFrecuencySubscribe :selected").text();
		period = $("#ddlPeriodSubscribe :selected").text();

		if (downloadName.length == 0) {
			$("#pnlMessage").append("<strong>Formulario incompleto!</strong> Por favor selecciona un reporte.");
			$("#pnlMessage").show();

			return;
		}

		$("#ddlHotspotSubscribe :selected").each(function (i, selected) {
			routerIds.push($(selected).val());
		});

		if (routerIds.length == 0) {
			$("#pnlMessage").append("<strong>Formulario incompleto!</strong> Por favor selecciona un hotspot.");
			$("#pnlMessage").show();

			return;
		}

		$("#downloadNameSubscription").val(downloadName);
		$("#routerIdsSubscription").val(routerIds.join(", "));
		$("#period").val(period);
		$("#frecuency").val(frecuency);
		$("#email").val(email);
		$("#btnSubscribe").hide();
		$("#spnSubscribe").show();

		$.ajax({
			type: "Post",
			cache: false,
            //url: '/Subscriptions/Subscribe',
            url: '/Subscriptions/Create',
			data: form.serialize(),
		}).done(function (data) {
			var response = data;
			if (response.Success) {
				$("#pnlMessage").addClass("alert-success");
				$("#pnlMessage").append(data.Message);
				$("#pnlMessage").show();
			} else {
				$("#pnlMessage").addClass("alert-danger");
				$("#pnlMessage").append(data.Message);
				$("#pnlMessage").show();
			}
			$("#btnSubscribe").show();
			$("#spnSubscribe").hide();
		}).fail(function (jqXHR, textStatus, errorThrown) {
			$("#pnlMessage").show();
		});
    });

    $('#ddlDownload').change(function () {
        if ($('#ddlDownload :selected').text() === 'White Label') {
            $('#whiteLabelsList').removeClass('hidden');
        } else {
            $('#whiteLabelsList').addClass('hidden');
        }
    });

    function searchRouters() {
        var hotspot = $("#searchRouter").val().toLowerCase();

        if (hotspot.length < 3) {
            $("#routerList li").each(function () {
                $(this).show();
            });

        } else {

            $("#routerList li").each(function () {
                if ($("input:checkbox", this).attr("name").toLowerCase().indexOf(hotspot) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    }

    $("#searchRouter").change(function () {
        searchRouters();
        if ($("#btnSelectChecked").data("checked")) {
            selectCheckedRouters(true);
        }
    });

    function searchReports() {
        var report = $("#searchReports").val().toLowerCase();

        if (report.length < 3) {
            $("#reportList li").each(function () {
                $(this).show();
            });
            return;
        }

        $("#reportList li").each(function () {
            if ($("input:checkbox", this).attr("name").toLowerCase().indexOf(report) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $("#searchReports").change(function () {
        searchReports();
    });

    $("#btnSelectAllRouters").click(function () {
        var allSelected = JSON.parse($(this).attr("all"));
        if (allSelected) {
            $(this).attr("all", false);
            $(this).text("Todos");
            $("#routerList li span input[type='checkbox']:visible:not([disabled])").parent().removeClass("checked");
            $("#routerList li span input[type='checkbox']:visible:not([disabled])").prop('checked', false);;
        } else {
            $(this).attr("all", true);
            $(this).text("Ninguno");
            $("#routerList li span input[type='checkbox']:visible:not([disabled])").parent().addClass("checked");
            $("#routerList li span input[type='checkbox']:visible:not([disabled])").prop('checked', true);;
        }
    });

    $("#btnSelectAllReports").click(function () {
        var allSelected = JSON.parse($(this).attr("all"));
        if (allSelected) {
            $(this).attr("all", false);
            $(this).text("Todos");
            $("#reportList li span input[type='checkbox']:visible").parent().removeClass("checked");
            $("#reportList li span input[type='checkbox']:visible").prop('checked', false);
        } else {
            $(this).attr("all", true);
            $(this).text("Ninguno");
            $("#reportList li span input[type='checkbox']:visible").parent().addClass("checked");
            $("#reportList li span input[type='checkbox']:visible").prop('checked', true);
        }
    });

    function selectCheckedRouters(forceCheck) {
        var marcados = $("#btnSelectChecked").data("checked");
        if (marcados && !forceCheck) {
            $("#btnSelectChecked").data("checked", false).parent().children('.icon-check').css('color', '');
            $("#routerFilter").css('color', '');

            searchRouters();

            $("#routerList li").each(function () {
                $("input[type='checkbox']:visible", this).show()
            });

        } else {
            $("#btnSelectChecked").data("checked", true).parent().children('.icon-check').css('color', 'green');
            $("#routerFilter").css('color', 'red');

            var routers = $("#routerList li"),
                routersLength = routers.length,
                i,
                $checkbox;

            for (i = 0; i < routersLength; i++) {
                $checkbox = $(routers[i]).find("input[type='checkbox']");
                if ($(routers[i]).css('display') != 'none' && $checkbox.prop('checked')) {
                    $(routers[i]).show();
                } else {
                    $(routers[i]).hide();
                }
            }

        }
    }

    $("#btnSelectChecked").click(function () {
        selectCheckedRouters();
    });

    $("#reportList li span input[type='checkbox']").change(function () {
        var chk = $(this);
        if (this.checked) {
            if ($(this).data('routers').length == 0) {
                $.ajax({
                    type: "Post",
                    dataType: "json",
                    //cache: false,
                    url: '/Subscriptions/GetRoutersByReport',
                    data: { id: chk.data('bind') },
                }).done(function (data) {
                    chk.data('routers', data);
                    $.each(data, function (i, item) {
                        $("#" + data[i].Id).parent().addClass("checked").parent().addClass('disabled');
                        $("#" + data[i].Id).prop("checked", true);
                    })

                    if (chk.data('bind') == 1) {
                        //TODOS
                        $.each($("#reportList li span input[type='checkbox']"), function (i, item) {
                            //Quita las marcas y deshabilita el resto de los checkboxes
                            if ($(this).data('bind') > 1) {
                                $(this).prop('checked', false);
                                $(this).prop('disabled', true);
                            }
                        })
                    }
                });
            } else {
                var routers = $(this).data('routers');
                $.each(routers, function (i, item) {
                    $("#" + routers[i].Id).parent().addClass("checked").parent().addClass('disabled');
                    $("#" + routers[i].Id).prop("checked", true);

                })

            }

            if (chk.data('bind') == 1) {
                //TODOS
                $.each($("#reportList li span input[type='checkbox']"), function (i, item) {
                    //Quita las marcas y deshabilita el resto de los checkboxes
                    if ($(this).data('bind') > 1) {
                        $(this).prop('checked', false).prop('disabled', true);
                        $(this).parent().removeClass("checked").parent().addClass('disabled');
                    }
                })
            }

            if ($("#btnSelectChecked").data("checked")) {
                selectCheckedRouters(true);
            }
        } else {

            var routers = $(this).data('routers');
            $.each(routers, function (i, item) {
                $("#" + routers[i].Id).parent().removeClass("checked").parent().removeClass('disabled');
                $("#" + routers[i].Id).prop("checked", false);

            })

            if (chk.data('bind') == 1) {
                //TODOS
                $.each($("#reportList li span input[type='checkbox']"), function (i, item) {
                    //Quita las marcas y deshabilita el resto de los checkboxes
                    if ($(this).data('bind') > 1) {
                        $(this).prop('checked', false).prop('disabled', false);
                        $(this).parent().parent().removeClass('disabled');
                    }
                })
            }
        }

    });
});