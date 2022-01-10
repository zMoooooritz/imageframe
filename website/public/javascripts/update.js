
function scheduleChange() {
    $('#schedule_submit').prop('disabled', $('#fstime').val() == '' || $('#fetime').val() == '');
}

$('#fnimages').on('change', function() {
    $('#images_n_submit').prop('disabled', $('#fnimages')[0].files.length == 0 ? true : false);
});

$('#fdimages').on('input change', function() {
    var hasSelected = false;
    $('#fdimages :selected').each(function() {
        if ($(this).val() != '')
            hasSelected = true;
    });
    $('#images_d_submit').prop('disabled', !hasSelected);
});

$('#delete_images').on('submit', function(event) {
    return confirm('Sollen die ausgewählten Bilder wirklich gelöscht werden?');
});

$('#delete_all_images').on('submit', function(event) {
    return confirm('Sollen wirklich alle Bilder gelöscht werden?');
});

$('#fstime').on('input', function() {
    scheduleChange();
});

$('#fetime').on('input', function() {
    scheduleChange();
});

$('#schedule_delete').on('submit', function(event) {
    return confirm('Soll der Zeitplan wirklich gelöscht werden?');
});

$('#shutdown_raspi').on('submit', function(event) {
    return confirm('Soll der Bilderrahmen wirklich heruntergefahren werden?');
});

$('#reboot_raspi').on('submit', function(event) {
    return confirm('Soll der Bilderrahmen wirklich neu gestartet werden?');
});
