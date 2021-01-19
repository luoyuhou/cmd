//事件委托给父级div来处理
$(document).ready(function () {
  $("#logs").on("click", "a", function (event) {
    let target = $(event.target);
    $(".tab-log").removeClass('active');
    $(".tab").removeClass("active");
    //添加css样式
    target.addClass("active");
    //取自定义字段里面的值(即a标签里面的tab字段)
    //tab字段里面存的是各个标签页的id, 以此来控制显示和隐藏
    $("#" + target.attr("tab")).addClass('active');
  });
});

function log(cmd, type) {
  exec(cmd).then(res => {
    if (res) {
      const body = $(`#tab-log${type} div.response`);
      body.empty();
      body.append(`<pre>${res}</pre>`);
    }
  });
}

function getLocalBranchToLog() {
  exec('git branch').then(res => {
    const branchs = res.split('\n').filter((value) => !!value.trim());
    if (branchs.length) {
      const select = $('#branch_log');
      select.empty();
      let options = '<option value></option>';
      branchs.map((value) => {
        if(value.includes('*')) {
          const b = value.slice(value.indexOf('*') + 1);
          options += `<option value="${b}" selected>${value}</option>`;
        } else {
          options += `<option value="${value}">${value}</option>`;
        }
      });
      select.append(options);
      select.selectpicker('refresh');
      select.selectpicker('render');
    }
  })
}

function log_v2() {
  const oneline = $('#oneline').bootstrapSwitch('state');
  const pretty = $('#pretty').bootstrapSwitch('state');
  const graph = $('#graph').bootstrapSwitch('state');
  const stat = $('#stat').bootstrapSwitch('state');
  const branch = $('#branch_log').val();
  const commit = $('#commit').val();
  const author = $('#author').val();
  const since = $('#since').val();
  const until = $('#until').val();
  let cmd = 'git log';
  if (oneline && pretty) {
    cmd += ' --pretty=oneline';
  } else if (oneline) {
    cmd += ' --oneline';
  }
  if (graph) {
    cmd += ' --graph'
  }
  if (stat) {
    cmd += ' --stat';
  }
  if (branch) {
    cmd += ` ${branch}`;
  }
  if (commit) {
    cmd += ` -${commit}`
  }
  if (author) {
    cmd += ` --author="${author}"`;
  }
  if (since) {
    cmd += ` --since="${since}"`;
  }
  if (until) {
    cmd += ` --until="${until}"`
  }
  log(cmd, 1);
}
