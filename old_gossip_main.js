$(document).ready(function () {
    // Load users on page load
    loadUsers();

    function loadUsers() {
        $.ajax({
            url: "load_users.php",
            method: "GET",
            success: function (data) {
                $("#chat-users").html(data);
            },
            error: function (xhr, status, error) {
                console.error("Error loading users:", error);
            }
        });
    }

    // Handle user selection and message loading
    $(document).on("click", ".chat-user", function () {
        $(".chat-user").removeClass("active");
        $(this).addClass("active");

        var userId = $(this).data("id");
        var userName = $(this).data("name");

        if (userName) {
            $("#chat-user-name").text(userName);
        } else {
            $("#chat-user-name").text("Welcome to Gossip");
        }

        $("#chat-box").html("<p class='text-center'>Loading messages...</p>");
        loadMessages(userId);
    });

    function loadMessages(userId) {
        $.ajax({
            url: "load_messages.php",
            method: "POST",
            data: { user_id: userId },
            success: function (data) {
                $("#chat-box").html(data);
                scrollToBottom();
            }
        });
    }

    function scrollToBottom() {
        var chatBox = document.getElementById("chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Handle message sending
    $("#send-btn").click(function () {
        var message = $("#message").val().trim();
        var receiverId = $(".chat-user.active").data("id");

        if (!receiverId) {
            alert("Please select a user to chat with.");
            return;
        }

        if (message === "") {
            return; // Don't send empty messages
        }

        $.ajax({
            url: "send_message.php",
            method: "POST",
            data: { receiver_id: receiverId, message: message },
            success: function (response) {
                if (response.includes("Success")) {
                    $("#message").val("");
                    loadMessages(receiverId);
                } else {
                    alert(response);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error sending message:", error);
            }
        });
    });

    // Send message on Enter key press
    $("#message").on("keypress", function (e) {
        if (e.which === 13) { // 13 is the Enter key
            e.preventDefault(); // Prevent form submission
            $("#send-btn").click();
        }
    });

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const body = document.body;

    let currentTheme = localStorage.getItem("theme") || "light";
    applyTheme(currentTheme);

    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            themeIcon.src = "assets/img/sun.png";
        } else {
            body.classList.remove("dark-mode");
            themeIcon.src = "assets/img/moon.png";
        }
        localStorage.setItem("theme", theme);
    }

    themeToggle.addEventListener("click", () => {
        currentTheme = body.classList.contains("dark-mode") ? "light" : "dark";
        applyTheme(currentTheme);
    });

    // Settings and Help panels
    $("#openSettings").click(function (e) {
        e.preventDefault();
        $("#settingsPanel").fadeIn(200);
    });

    $("#closeSettings").click(function () {
        $("#settingsPanel").fadeOut(200);
    });

    $("#openHelp").click(function (e) {
        e.preventDefault();
        $("#helpPage").fadeIn(200);
    });

    $(".close-help").click(function () {
        $("#helpPage").fadeOut(200);
    });

    // Message actions (delete, edit, etc.)
    // This part of your JS seems complex and might need further adjustments based on your HTML structure for message actions.
    // I'm keeping the logic but you might need to review the selectors.

    let pendingAction = null;

    function showConfirm(message, yesCallback) {
        $('#confirm-message').text(message);
        $('#custom-confirm').fadeIn();
        pendingAction = yesCallback;
    }

    function showAlert(message, okCallback = null) {
        $('#alert-message').text(message);
        $('#custom-alert').fadeIn();
        if (okCallback) {
            $('#alert-ok').off('click').on('click', function() {
                $('#custom-alert').fadeOut();
                okCallback();
            });
        } else {
            $('#alert-ok').off('click').on('click', function() {
                $('#custom-alert').fadeOut();
            });
        }
    }

    $('#confirm-yes').click(function() {
        $('#custom-confirm').fadeOut();
        if (pendingAction) pendingAction();
        pendingAction = null;
    });

    $('#confirm-no').click(function() {
        $('#custom-confirm').fadeOut();
        pendingAction = null;
    });

    $('#chat-box').on('click', '.action-toggle', function(e) {
        e.stopPropagation();
        $('.action-menu').not($(this).next()).hide();
        $(this).next('.action-menu').toggle();
    });

    $(document).on('click', function() {
        $('.action-menu').hide();
    });

});
