$(document).ready(function () {

    $("#searchUser").change(function () {
        var username = $(this).val().toLowerCase();

        if (username.length < 3) {
            $("#userList li").each(function () {
                $(this).show();
            });
            return;
        }

        $("#userList li").each(function () {
            if ($("input:checkbox", this).attr("name").toLowerCase().indexOf(username) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $("#searchRouter").change(function () {
        var hotspot = $(this).val().toLowerCase();

        if (hotspot.length < 3) {
            $("#routerList li").each(function () {
                $(this).show();
            });
            return;
        }

        $("#routerList li").each(function () {
            if ($("input:checkbox", this).attr("name").toLowerCase().indexOf(hotspot) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $("#btnSelectAllUsers").click(function () {
        var allSelected = JSON.parse($(this).attr("all"));
        if (allSelected) {
            $(this).attr("all", false);
            $(this).text("Todos");
            $("#userList li span input[type='checkbox']:visible").parent().removeClass("checked");
            $("#userList li span input[type='checkbox']:visible").prop('checked', false);;
        } else {
            $(this).attr("all", true);
            $(this).text("Ninguno");
            $("#userList li span input[type='checkbox']:visible").parent().addClass("checked");
            $("#userList li span input[type='checkbox']:visible").prop('checked', true);;
        }
    });

    $("#btnSelectAllRouters").click(function () {
        var allSelected = JSON.parse($(this).attr("all"));
        if (allSelected) {
            $(this).attr("all", false);
            $(this).text("Todos");
            $("#routerList li span input[type='checkbox']:visible").parent().removeClass("checked");
            $("#routerList li span input[type='checkbox']:visible").prop('checked', false);;
        } else {
            $(this).attr("all", true);
            $(this).text("Ninguno");
            $("#routerList li span input[type='checkbox']:visible").parent().addClass("checked");
            $("#routerList li span input[type='checkbox']:visible").prop('checked', true);;
        }
    });

    $("#btnSave").click(function () {
        $("#pnlMessage").hide();
        $("#pnlMessage").removeClass("alert-danger");
        $("#pnlMessage").removeClass("alert-success")

        var data = {};
        var url = "";
        var id = $("#hdnReportId").val();
        var reportName = $("#txtReportName").val();
        var routerIds = $("#routerList li input:checked").map(function () { return this.value; }).get();
        var userIds = $("#userList li input:checked").map(function () { return this.value; }).get();

        if (id != null) {
            data = { "id": id, "reportName": reportName, "userIds": userIds, "routerIds": routerIds }
            url = "/Reports/Edit";
        } else {
            data = { "reportName": reportName, "userIds": userIds, "routerIds": routerIds }
            url = "/Reports/Create";
        }

        $.ajax({
            type: "Post",
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            traditional: true,
        }).done(function (data) {
            window.location.href = data
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $("#pnlMessage").addClass("alert-danger");
            $("#pnlMessage").append("<strong>Error!</strong> Ha ocurrido un error, por favor inténtalo nuevamente.");
            $("#pnlMessage").show();
        });;
    });


    $('.botshow').click(function () {

        $(this).closest('tr').next('tr').show(1000);

  
        var hpid = $(this).data('hpid');
        var hstatus = $(this).data('hstatus');
        var data = {};
        var url = "";

        data = { "routerId": hpid, "status": hstatus }
        url = "/Reports/Stats";


        $.ajax({
            type: "Post",
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            traditional: true,
        }).done(function (data) {
           
            var up24 = data["up24"] * 100;
            var up7 = data["up7"] * 100;
            var up30 = data["up30"] * 100;
            var maxCon = data["maxCon"];
            var horaMaxCon = data["horaMaxCon"];

            var htmlStats = "";
            htmlStats += '<div><table class="table"><tr>';
            htmlStats += '<td>Max. conexiones siumultaneas (últimas 24hrs):<strong> ' + maxCon + '</strong> <span> ' +  horaMaxCon + ' </span></td>';
            htmlStats += '<td>% Up Time (Ult 24 horas)<strong> ' + up24.toFixed(0) + '%</strong></td></tr>';
            htmlStats += '<tr><td>% Up Time (Ult 7 días)<strong> ' + up7.toFixed(0) + '%</strong></td><td>% Up Time (Ult 30 días)<strong> ' + up30.toFixed(0) +'%</strong></td>';
            htmlStats += '</tr></table></div>'

           



            htmlStats = `<div class="row">

    <div class="col-lg-1">
     </div>

    <div class="col-lg-2">
            <!-- START widget-->
            <div class="panel widget bg-gray-darker">
                <div class="panel-body">

                   
                    <div class="h5">Up Time (Ult 24 horas)</div>
                    <h3 class="mt0 text-info"><strong>_up24_%</strong></h3>


                </div>
            </div>
            <!-- END widget-->
        </div>

        <div class="col-lg-2">
            <!-- START widget-->
            <div class="panel widget bg-info">
                <div class="panel-body ">

                   
                    <div class="h5">Up Time (Ult 7 Días)</div>
                    <h3 class="mt0 text-info"><strong>_up7_%</strong></h3>
                </div>
            </div>
            <!-- END widget-->
        </div>

        <div class="col-lg-2">
            <!-- START widget-->
            <div class="panel widget bg-success">
                <div class="panel-body">
                    
                    <div class="h5">Up Time (Ult 30 Dias)</div>
                    <h3 class="mt0 text-info"><strong>_up30_%</strong></h3>

                </div>
            </div>
            <!-- END widget-->
        </div>
        <div class="col-lg-4">
            <!-- START widget-->
            <div class="panel widget bg-success">
                <div class="panel-body">

                    <div class="h5">Máx conexiones simultaneas (Ult 24 hrs) </div>
                    <h3 class="mt0 text-info"><strong>_maxcon_</strong></h3> <small> a las <strong> _hora_ </strong><small>

                </div>
            </div>
            <!-- END widget-->
        </div>
    <div class="col-lg-1">
     </div>

    </div>`;


            var htmlStats = htmlStats.replace('_up24_', up24.toFixed(0));
            var htmlStats = htmlStats.replace('_up30_', up30.toFixed(0));
            var htmlStats = htmlStats.replace('_up7_', up7.toFixed(0));
            var htmlStats = htmlStats.replace('_maxcon_', maxCon);
            var htmlStats = htmlStats.replace('_hora_', horaMaxCon);


            
            
            var idiv = 'dth-' + hpid;
            $("#" + idiv).delay(500).html(htmlStats);



            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("ocurrio un error al recuperar info")
        });;


    });

    window.onload = function () {
    	window.setTimeout(document.reportsForm.submit.bind(document.reportsForm), 60000);
    };
});