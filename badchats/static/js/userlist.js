$(document).ready(function() {
	getUser();
});

$(document).on("click", "#delUserButton", function() {
	var userId = $(this).data('id');
	var userName = $(this).data('user');
	var delContext = 'Please besure User:' + '<b style="color:red">' + userName + '</b>';
	var jData = '{"id": "' + userId +'"}';
	$('#delUserName').empty(); 
	$('#delUserName').append(delContext); 
	$('#delUserModal').modal('show');
	$('#delYes').click(function() {
		$.ajax({
			url: "http://127.0.0.1:8001/api/deluser",
			type: "POST",
			dataType: "json",
			data: jData,
			success: function(reponse){
				var jStatus = reponse.status;
				var uid = '#'+ userId;
				var notStatus = '';
				var notContext = '';
				$(uid).remove();
				if (jStatus)
					{notStatus = 'success';
					 notContext = 'User: ' + userName + ' was Delete!';}
				else
					{notStatus = 'error';
					 notContext = 'Delete Error!';}
				$('#status').notify(notContext, notStatus);
			}
		});
		$('#delUserModal').modal('hide');
	});
});


$(document).on("click", "#updateUserPassModal", function() {
	var userId = $(this).data('id');
	var userName = $(this).data('user');
	$('#updateUserModal').modal('show');
	$("#changePassButton").click(function() {
		var userPass = $("input#updatePass").val();
		var jData = '{"id": "' + userId + '", "password": "' + userPass +'"}';
		$.ajax({
			url: "http://127.0.0.1:8001/api/updateuser",
			type: "POST",
			dataType: "json",
			data: jData,
			success: function(reponse){
				var jStatus = reponse.status;
				var notStatus = '';
				var notContext = '';
				if (jStatus)
					{notStatus = 'success';
					 notContext = 'User: ' + userName + ' password was updated!';}
				else
					{notStatus = 'error';
					 notContext = 'Error: password updated failed!';}
				$('#status').notify(notContext, notStatus);
			}
		});
		$('#updateUserModal').modal('hide');
	});
});

$(document).on("click", '#searchButton', function() {
	var keyword = $('input#userSearch').val();
	getUser(keyword);
});

$(document).on("keyup", "input#userSearch", function() {
	var keyword = $('input#userSearch').val();
	getUser(keyword);
});

function getUser(userName = '') {
	var jData = '{"username": "' + userName +'"}';
	$.ajax({
		url: "http://127.0.0.1:8001/api/getuser", 
		type: "POST",    
		dataType:"json",
		data: jData,
		success: function(reponse) {
			<!-- tables_line -->
			var jHTML = '<tr class="table-name-fonts">';
			var pageCount = 0;
			var pageSize = 10;
			var entriesCount = 0;
			var colCount = 3;
			var varTfootContext = '';
			var tfootClass = 'fonts-center';
			var tfoot = '';
			$.each(reponse.tables_name, function(b, k){
				jHTML += '<th>' + k + '</th>';
			});
			jHTML += '<th>options</th></tr>';
			<!-- context_line -->
			$.each(reponse.userlist, function(i,n){
				jContext =  '<div class="btn-group">' + 
				            '<a class="btn btn-danger" id="delUserButton" data-id="'+n.id+ '" data-user="' + n.username +'" href="#"  data-toggle="modal"  role="button"><i class="fa  fa-trash-o  fa-sm"></i> Delete</a>' +
				            '<a type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" href="#" aria-haspopup="true" aria-expanded="false">' +
				            	'<span class="caret"></span>' +
				            	'<span class="sr-only">Toggle Dropdown</span>' +
				            '</a>' +
				            '<ul class="dropdown-menu">' +
				            	'<li><a href="#"  data-id="'+ n.id +'" data-user="' + n.username + '" data-toggle="modal" id="updateUserPassModal" role="button" ><i class="fa fa-fw fa-pencil" ></i> Change PassWD</a></li>' +
				            '</ul></div>'
			
				jHTML += "<tr id='" + n.id +"' class='table-name-fonts-1'>" + 
						 "<td>" + n.id + "</td>" +
						 "<td>" + n.username + "</td>" + 
						 "<td>" + jContext + "</td>" + 
						 "</tr>";
				entriesCount = i + 1;
			});
			if (entriesCount == 0)
				{varTfootContext = 'Data is nothing!';}
			else
				{varTfootContext = 'Showing ' + entriesCount + ' Entries';
				 tfootClass = 'fonts-left';}
			jHTML += '<tr><td colspan="' + parseInt(3) + '" class="'+ tfootClass +'">'+ varTfootContext +'</td></tr>';
			var pageNum = Math.ceil(pageCount / pageSize);
			$('#getuser').html(jHTML);
		}
	});
}
