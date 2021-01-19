//事件委托给父级div来处理
$(document).ready(function () {
  $("#tabs").on("click", "a", function (event) {
    let target = $(event.target);
//      $(".tab-item").hide();
    $(".tab-item").removeClass('active');
    $(".tab").removeClass("active");
    //添加css样式
    target.addClass("active");
    //取自定义字段里面的值(即a标签里面的tab字段)
    //tab字段里面存的是各个标签页的id, 以此来控制显示和隐藏
//      $("#" + target.attr("tab")).show();
    $("#" + target.attr("tab")).addClass('active');
  });
});

/**
 * 获取本地分支
 */
function getLocalBranch() {
  exec('git branch').then(res => {
    const branchs = res.split('\n').filter((value) => !!value.trim());
    if (branchs.length) {
      const oSelect = $('#origin');
      const tSelect = $('#target');
      oSelect.empty();
      tSelect.empty();
      let options = '';
      branchs.map((value) => {
        if(value.includes('*')) {
          const b = value.slice(value.indexOf('*') + 1);
          oSelect.append(`<option value="${b}">${value}</option>`);
          options += `<option value="${b}" selected>${value}</option>`;
        } else {
          options += `<option value="${value}">${value}</option>`;
        }
      });
      tSelect.append(options);
      oSelect.selectpicker('refresh');
      oSelect.selectpicker('render');
      tSelect.selectpicker('refresh');
      tSelect.selectpicker('render');
    }
  })
}

/**
 * 切换分支
 */
function checkout() {
  const cmd = $('#target').val();
  if (cmd) {
    branch(`git checkout ${cmd}`, 4);
  }
}

function branch(cmd, type) {
  exec(cmd).then(res => {
    if (res) {
      const body = $(`#tab-item${type} div.response`);
      body.empty();
      if (type === 2) {
        const arr = res.split('\n').filter((value) => value.includes('remote'));
        res = arr.join('\n');
      }
      body.append(`<pre>${res}</pre>`);
    }
  });
}

/**
 * 创建或移出本地分支
 */
function createOrRemoveBranch() {
  const cmd = $('#create_branch').val();
  if (cmd) {
    const type = $('#type').text();
    if (type === 'Create') {
      branch('git checkout -b ' + cmd, 3);
    } else  if(type === 'Remove') {
      branch('git branch -D ' + cmd, 3);
    }
  }
}

/**
 * change branch operation type
 * @param type
 */
function changeType(type) {
  $('#type').text(type);
}
