
$('#fdirs').on('input', function() {
    var hasSelected = false;
    $('#fdirs :selected').each(function() {
        if ($(this).val() != '')
            hasSelected = true;
    });
    $('#slide_start').prop('disabled', !hasSelected);
});

$('#fimagedel').on('input', function() {
    var hasSelected = false;
    $('#fimagedel :selected').each(function() {
        if ($(this).val() != '')
            hasSelected = true;
    });
    $('#fimage_delete').prop('disabled', !hasSelected);
});

$('#fdird').on('input', function() {
    $('#fimage_delete').prop('disabled', true);
});

$('#image_delete').on('submit', function(event) {
    console.log(event);
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
    return confirm('Soll der Bilderrahmen wirklich neugestartet werden?');
});

$('#update_software').on('submit', function(event) {
    return confirm('Soll der Bilderrahmen wirklich aktualisiert und neugestartet werden?');
});
