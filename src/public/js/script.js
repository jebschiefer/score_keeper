(function() {
    $(function() {
        $("#update-scores-button").click(function(event) {
            event.preventDefault();

            $("#update-scores-button").hide();
            $(".update-scores").show();
            $("#submit-scores-button").show();
        });

        $("#submit-scores-button").click(function(event) {
            event.preventDefault();

            $(".update-error").hide();

            var players = [];

            $(".update-scores-table tbody tr").each(function() {
                var player = {};

                $(this).find('td').each(function(i) {
                    if (i === 0) {
                        player["name"] = $(this).text();
                    } else {
                        var input = $($(this).find("input")[0]);
                        var isChecked = input.is(":checked");
                        var name = input.attr("name");

                        player[name] = isChecked;
                    }
                });

                players.push(player);
            });

            players = players.filter(function(player) {
                return player.played;
            });

            var winner = players.filter(function(player) {
                return player.won;
            });

            if (!winner.length) {
                $(".update-error").text("Someone must have won!");
                $(".update-error").show();
                return;
            }

            var payload = JSON.stringify({ players: players });

            $.ajax({
                method: "PUT",
                url: "/api" + location.pathname,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: payload,
                success: function() {
                    window.location.reload();
                }
            });
        });

        $("input[type='radio']").click(function() {
            var playedInput = $($(this).parent().prev().find("input")[0]);
            playedInput.attr("checked", true);
        });
    });
})();
