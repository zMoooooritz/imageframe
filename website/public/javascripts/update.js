
function scheduleChange() {
    $('#screen_schedule').prop('disabled', $('#fstime').val() == '' || $('#fetime').val() == '');
}
$('#fstime').on('input', scheduleChange);
$('#fetime').on('input', scheduleChange);

$('#image_delete').on('submit', function(event) {
    return confirm('Sollen die ausgewählten Bilder wirklich gelöscht werden?');
});

$('#directory_delete').on('submit', function(event) {
    return confirm('Soll der ausgewählte Ordner wirklich gelöscht werden?');
});

$('#screen_noschedule').on('submit', function(event) {
    return confirm('Soll der Zeitplan wirklich gelöscht werden?');
});

$('#power_off').on('submit', function(event) {
    return confirm('Soll der Bilderrahmen wirklich heruntergefahren werden?');
});

$('#power_reboot').on('submit', function(event) {
    return confirm('Soll der Bilderrahmen wirklich neu gestartet werden?');
});
