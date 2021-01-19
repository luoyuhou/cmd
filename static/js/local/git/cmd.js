const cmds = [];
let index = -1;
const command = $('#command');

function clear_cmd() {
  command.val('');
}

function exec_cmd() {
  const cmd = command.val();
  exec(cmd).then(res => {
    cmds.push({cmd, value: res});
    index++;
    updateHistory();
  })
}

function updateHistory() {
  const history = $('#history');
  const body = $(`#cmd div.response`);
  body.empty();
  history.empty();
  let options = '';
  cmds.forEach((row, i) => {
    if(i === index) {
      options += `<option value="${i}" selected>${row.cmd}</option>`;
      body.append(`<pre>${row.value}</pre>`);
      command.val(row.cmd)
    } else {
      options += `<option value="${i}">${row.cmd}</option>`;
    }
  });
  history.append(options);
  history.selectpicker('refresh');
  history.selectpicker('render');
}

command.on('keydown', () => {
  if (event.keyCode === 38) {
    if (index > 0) {
      index--;
      updateHistory()
    }
  } else if(event.keyCode === 40) {
    if (index < cmds.length - 1) {
      index++;
      updateHistory();
    }
  } else if (event.keyCode === 13) {
    exec_cmd();
  }
});


function selectOnChange(obj) {
  index = obj.selectedIndex;
  updateHistory();
}
