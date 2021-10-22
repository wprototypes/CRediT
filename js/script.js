let roles = {
  1: 'Conceptualization',
  2: 'Data curation',
  3: 'Formal analysis',
  4: 'Funding acquisition',
  5: 'Project administration',
  6: 'Methodology',
  7: 'Investigation',
  8: 'Supervision',
  9: 'Visualization',
  10: 'Resources',
  11: 'Software',
  12: 'Validation',
  13: 'Writing-original draft',
  14: 'Writing-reviewing &amp editing',
}

let selectedRoles = ''
let assignedRoles = false
let email = ''
var rowAuthorsList = {}

function submitEmail() {
  event.preventDefault
  email = jQuery('#userId').val()
  window.location.href = jQuery('#participant-form').attr('action')+"?userId="+jQuery('#userId').val();
}

function assignRoleFun() {
  var url_string = window.location.href
  var url = new URL(url_string);
  var email = url.searchParams.get("userId");
  email = email.replace('%40', '@');
  if (config && Object.keys(config).length !== 0) {
    for (const [key, value] of Object.entries(config)) {
      if (key === email) {
        rowAuthorsList = value.authors;
      } 
    }
  }
  $('#saveRolesBtn').removeClass('btn-danger')
  $('#saveRolesBtn').removeClass('warninngRed')
  $('#saveRolesBtn').addClass('btn-primary')
  $('#saveRolesBtn')[0].style.removeProperty('background-color');
  $('#saveRolesBtn')[0].style.setProperty("background-color", "#005274");
  $(".fa-check").hide().css("color","green");

  // Progress bar inital changes
  $('#progressDiv').removeAttr('style')
  document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow', 0);
  document.getElementsByClassName('progress-bar').item(0).setAttribute('style', 'width:' + Number(0) + '%');
  $('#assignedCount').text(`0/${Object.keys(rowAuthorsList).length}`)
  $('#assignedUserWarningTag').text('')

  // Form submit btn related inital changes ------
  $('#formSubmitBtn').removeClass('btn-danger')
  $('#formSubmitBtn').addClass('btn-primary')
  $('#formSubmitBtn')[0].style.removeProperty('background-color');
  $('#formSubmitBtn')[0].style.setProperty("background-color", "#005274", 'important');
  $('#main-warning-tag').addClass('d-none')
  $('#assign-role-warning-tag').addClass('d-none')
  $('#asignRoleCard').css({ 'border-style': "solid", 'border-color': "#000000" })
  let addHtml = ''
  if (rowAuthorsList && Object.keys(rowAuthorsList).length !== 0) {
    for (let key in rowAuthorsList) {
      addHtml += ` <tr class="tableUserListTr"><th width="15%">${rowAuthorsList[key]}<br><small></small></th><td class="${rowAuthorsList[key]}-rolesList roles-td row tableUserListTd" data-user-id="${key}">`
        if (roles && Object.keys(roles).length !== 0) {
          for (let role in roles) {
           addHtml += `<div class="form-check-inline col-md-3 mr-0">
           <label class="form-check-label">
           <input type="checkbox" class="form-check-input cheeck-input-${role}" value="${role}">
           <span>${roles[role]}</span>
           </label></div>`
        }
      }
      addHtml += `</td></tr>`
    }
    addHtml += `</td></tr>`
    
    let footeraddHtml = `<tr class="tableUserListTr"><th width="15%"> Total </th><td class="rolesList-total row tableUserListTd">`
    if (roles && Object.keys(roles).length !== 0) {
      for (let role in roles) {
        footeraddHtml += `<div class="form-check-inline col-md-3 mr-0">
        <label class="total-role-lable" id="role-lable-${role}" disabled>
        <span> <label class="totleRoleCount" id="role-count-${role}" disabled>0</label disabled> ${roles[role]}</span>
        </label></div>`
      }
    }
    footeraddHtml += `</td></tr>`
    $('#authorListTableFooter').html(footeraddHtml)
    $("#authorListTable").html(addHtml)
  }
}

function confirmForm() {
  if (!assignedRoles) {
    $('#formSubmitBtn').removeClass('btn-primary')
    $('#formSubmitBtn').addClass('btn-danger')
    $('#formSubmitBtn')[0].style.removeProperty('background-color');
    $('#formSubmitBtn')[0].style.setProperty("background-color", "red", 'important');
    $('#asignRoleCard').css({ 'border-style': "solid", 'border-color': "red" });
    $('#assign-role-warning-tag').text('Author contribution required');
    $('#main-warning-tag').text('Some items require your attention.');
    $('#main-warning-tag').append('<p>Please correct the above to continue.</p>');
    $('#main-warning-tag').removeClass('d-none');
  }
}

function saveRoles() {
  var hasError = 0;
  var rolesWithCount = {};
  var usersWithRoles = {}
  $('.roles-td').each(function () {
    var userId = jQuery(this).data('user-id')
    usersWithRoles[userId] = [];
    var count = 0;
    $(this).find('.form-check-input').each(function () {
      if (jQuery(this).is(':checked')) {
        usersWithRoles[userId].push(jQuery(this).val())
        count++;
        var val = jQuery(this).val();
        if (rolesWithCount[val] == undefined) {
          rolesWithCount[val] = 1;
        } else {
          rolesWithCount[val] += 1;
        }
      }
    });
    if (count == 0) {
      hasError++
      $(this).parent().find('th').css({ 'border-style': "solid", 'border-color': "red" });
      $(this).parent().css({ 'border-style': "solid", 'border-color': "red" });
      $(this).parent().addClass('wariningRow')
      $('#saveRolesBtn').removeClass('btn-primary')
      $('#saveRolesBtn').addClass('btn-danger')
      $('#saveRolesBtn')[0].style.removeProperty('background-color');
      $('#saveRolesBtn').addClass('warninngRed')
    }
  });
  if (!hasError) {
    var rolesWithUser = {}
    for (let roleId in roles) {
      rolesWithUser[roleId] = [];
      for (let userId in usersWithRoles) {
        if (usersWithRoles[userId].indexOf(roleId) !== -1) {
          rolesWithUser[roleId].push(userId)
        }
      }
    }
    selectedRoles = rolesWithUser;

    let selectedUsersHtml = `
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th scope="col" style="width: 15%;">
            <center>Roles</center>
          </th>
          <th scope="col" style="width: 85%;">
            <center>Authors</center>
          </th>
        </tr>
      </thead>
      <div class="tbody">
      <tbody>`;

    if (rolesWithUser && Object.keys(rolesWithUser).length !== 0) {
      for (let role in rolesWithUser) {
        selectedUsersHtml += ` <tr><th>${roles[role]}</th><td class="roles-th">`
        let singleUser = rolesWithUser[role]
        let singleData = []
        for (let x = 0; x < singleUser.length; x++) {
          singleData.push(rowAuthorsList[singleUser[x]])
        }
        singleData.toString()
        let authorsList = singleData.join(",")
        authorsList = authorsList.replaceAll(",", ", ")
        selectedUsersHtml += `<span style="float: left;">${authorsList}</span>`
        selectedUsersHtml += `</td></tr>`
      }
      selectedUsersHtml += `</td></tr>`
      selectedUsersHtml += `</td></tr></tbody></div></table>`
      $('#selectedauthorsList').html(selectedUsersHtml)
    }
    $('#myModal').modal('hide')
    assignedRoles = true
    if (assignedRoles) {
      let editBtnHtml = `<button type="button" id="editRolesBtn" class="btn btn-outline" data-toggle="modal"
        data-target="#myModal" onclick="editRoleFun()">
        <span>Edit</span>
        </button>`
      $('#assignRolesBtnDiv').html(editBtnHtml)
    }
  } else {
    $('.wariningRow')[0].scrollIntoView();
    $('.progress').css('border','2px solid red');
    $('#assignedUserWarningTag').text(`${hasError} Authors are not assigned to any role.`)
    $('#assignedUserWarningTag').addClass('hasError')
  }
}

function editRoleFun () {
  console.log('edit')
  $('#progressDiv').removeAttr('style')
  document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow', 0);
  document.getElementsByClassName('progress-bar').item(0).setAttribute('style', 'width:' + Number(0) + '%');
  $('#assignedCount').text(`0/${Object.keys(rowAuthorsList).length}`)
  $('#assignedUserWarningTag').text('')
  $(".fa-check").hide();

  selectedRoles = ''
  assignedRoles = false

  let addHtml = ''
  if (rowAuthorsList && Object.keys(rowAuthorsList).length !== 0) {
    for (let key in rowAuthorsList) {
      addHtml += ` <tr class="tableUserListTr"><th width="15%">${rowAuthorsList[key]}<br><small></small></th><td class="${rowAuthorsList[key]}-rolesList roles-td row tableUserListTd" data-user-id="${key}">`
        if (roles && Object.keys(roles).length !== 0) {
          for (let role in roles) {
           addHtml += `<div class="form-check-inline col-md-3 mr-0">
           <label class="form-check-label">
           <input type="checkbox" class="form-check-input cheeck-input-${role}" value="${role}">
           <span>${roles[role]}</span>
           </label></div>`
        }
      }
      addHtml += `</td></tr>`
    }
    addHtml += `</td></tr>`
    
    //  Footer stickey row of total  ----------
    let footeraddHtml = `<tr class="tableUserListTr"><th width="15%"> Total </th><td class="rolesList-total row tableUserListTd">`
    if (roles && Object.keys(roles).length !== 0) {
      for (let role in roles) {
        footeraddHtml += `<div class="form-check-inline col-md-3 mr-0">
        <label class="total-role-lable" id="role-lable-${role}" disabled>
        <span> <label class="totleRoleCount" id="role-count-${role}">0</label> ${roles[role]}</span>
        </label></div>`
      }
    }
    footeraddHtml += `</td></tr>`

    //  Add dynamic generated HTML to table footer for the MODAL.
    $('#authorListTableFooter').html(footeraddHtml)
    $("#authorListTable").html(addHtml)
  }
}

$(document).on("click", ".form-check-label", function () {
  var hasError = 0;
  $('#saveRolesBtn').removeClass('btn-danger')
  $('#saveRolesBtn').addClass('btn-primary')
  $('#saveRolesBtn')[0].style.removeProperty('background-color');
  $('#saveRolesBtn')[0].style.setProperty("background-color", "#005274");
  $('.roles-td').each(function () {
    var count = 0;
    let parentEle = $(this).parent()
    $(this).find('.form-check-input').each(function () {
      if(jQuery(this).is(':checked')){
        parentEle.addClass('rowSelected')
        count++;
      }
    });
    if (count == 0) {
      hasError++;
      parentEle.removeClass('rowSelected')
    }
    if (count !== 0) {
      $(this).parent().find('th').removeAttr("style");
      $(this).parent().removeClass('wariningRow')
      $(this).parent().removeAttr("style");
    }
  });

  if (hasError) {
    var pcg = Math.floor(100 - hasError / Object.keys(rowAuthorsList).length * 100);
    $('#assignedCount').text(`${Object.keys(rowAuthorsList).length - hasError}/${Object.keys(rowAuthorsList).length}`)
    document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow', pcg);
    document.getElementsByClassName('progress-bar').item(0).setAttribute('style', 'width:' + Number(pcg) + '%');
    if ($('#assignedUserWarningTag').hasClass('hasError')) {
      $('#assignedUserWarningTag').text(`${hasError} Authors are not assigned to any role.`)
    }
  } else {
    document.getElementsByClassName('progress-bar').item(0).setAttribute('aria-valuenow', 100);
    document.getElementsByClassName('progress-bar').item(0).setAttribute('style', 'width:' + Number(100) + '%');
    $('#assignedCount').text(`${Object.keys(rowAuthorsList).length}/${Object.keys(rowAuthorsList).length}`)
    $('#assignedUserWarningTag').text('')
    $('#assignedUserWarningTag').removeClass('hasError')
  }

  let rolesCounter = 0;
  $(this).parent().parent().find('.form-check-input').each(function () {
    if (jQuery(this).is(':checked')) {
      rolesCounter++
    }
  });
  if (rolesCounter !== 0) {
    $(this).parent().parent().parent().find('small').text(`${rolesCounter} roles`)
  } else {
    $(this).parent().parent().parent().find('small').text('')
  }


  iscomplete = true;

  $('.roles-td').each(function () {
    var count = 0;
    $(this).find('.form-check-input').each(function () {
      if (jQuery(this).is(':checked')) {
        count++;
      }
    });
    if (count == 0) {
      iscomplete = false;
    }
  });
  if(iscomplete){
    $(".fa-check").show();
    $("#progressDiv").css("border","none");
    $("#saveRolesBtn").removeClass("warninngRed")
  }
  else{
    $(".fa-check").hide();
  }
  


});

// Updated total count at bottom of table
$(document).on("change", ".form-check-input", function () {
  if (jQuery(this).is(':checked')) {
    var checkboxVal = jQuery(this).val();
    $('#role-lable-' + checkboxVal).removeAttr('disabled')
    let cnt = jQuery('#role-count-' + checkboxVal).text()
    cnt = parseInt(cnt)
    jQuery('#role-count-' + checkboxVal).text(cnt + 1)
  } else {
    var checkboxVal = jQuery(this).val();
    let cnt = jQuery('#role-count-' + checkboxVal).text()
    cnt = parseInt(cnt)
    if (cnt == 1) {
      $('#role-lable-' + checkboxVal).attr('disabled', 'disabled');;
    }
    jQuery('#role-count-' + checkboxVal).text(cnt - 1)
  }
})
