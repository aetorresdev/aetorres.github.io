$(document).ready(function() {
  var users = [];
  var repos = [];
  $(".ghbtn").each( function () {
    var user = $(this).attr('user');
    var repo = $(this).attr('repo');
    if (repo && repo !== '__recent__') {
      repos.push(user + '/' + repo);
      if (users.indexOf(user) === -1) {
        users.push(user);
      }
    }
  });
  for (var i = 0; i < users.length; i++) {
    $.ajax({
      type: "GET",
      url: "https://api.github.com/users/" + users[i] + "/repos?per_page=100",
      async: true,
      dataType: "json",
      success: function (data) {
        for (var j = 0; j < data.length; j++) {
          if (repos.indexOf(data[j].full_name) !== -1) {
            var name = data[j].name;
            $("div[repo='" + name + "']").children(".star").html('<i class="fa fa-star"></i> ' + data[j].stargazers_count);
            $("div[repo='" + name + "']").children(".fork").html('<i class="fa fa-code-fork"></i> ' + data[j].forks_count);
          }
        }
      }
    });
  }

  // Recent repositories block (sorted by updated_at)
  var $recent = $("#recent-repos");
  if ($recent.length) {
    var ghUser = $recent.data("user");
    var count = parseInt($recent.data("count"), 10) || 6;
    $.ajax({
      type: "GET",
      url: "https://api.github.com/users/" + ghUser + "/repos?sort=updated&per_page=" + count,
      async: true,
      dataType: "json",
      success: function (data) {
        var html = "";
        for (var k = 0; k < data.length; k++) {
          var r = data[k];
          var desc = (r.description || "").substring(0, 120);
          if (r.description && r.description.length > 120) desc += "...";
          html += '<div class="col-sm-6 col-md-4 wow fadeInUp"><div class="team-member">';
          html += '<img src="' + (r.owner.avatar_url || "/static/assets/img/landing/github-mark.jpg") + '" class="img-responsive img-circle img-small" alt="" width="90" height="90">';
          html += '<h4><a href="' + r.html_url + '" target="_blank"><span class="navy">' + r.name + '</span></a></h4>';
          html += '<p>' + desc + '</p>';
          html += '<div user="' + r.owner.login + '" repo="' + r.name + '" class="ghbtn">';
          html += '<a target="_blank" style="width: 65px;" href="' + r.html_url + '/stargazers" class="btn btn-white btn-xs star"><i class="fa fa-star"></i> ' + (r.stargazers_count || 0) + '</a> ';
          html += '<a target="_blank" style="width: 65px;" href="' + r.html_url + '/network" class="btn btn-white btn-xs fork"><i class="fa fa-code-fork"></i> ' + (r.forks_count || 0) + '</a></div></div></div>';
        }
        $recent.html(html || "<p>No public repos.</p>");
      },
      error: function () {
        $recent.html("<p>Could not load recent repositories.</p>");
      }
    });
  }
});
