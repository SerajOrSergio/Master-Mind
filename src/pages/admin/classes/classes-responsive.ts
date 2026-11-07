// Classes page responsive glue — replaces the previously inline <script> block
// in classes/index.html: on small screens the sidebar markup is duplicated into
// the mobile sidebar container.
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar-container');
  const mobileSidebar = document.getElementById('sidebar-container-mobile');
  if (
    window.innerWidth < 768 &&
    mobileSidebar &&
    sidebar &&
    !mobileSidebar.innerHTML.trim() // keep the copy idempotent
  ) {
    mobileSidebar.innerHTML = sidebar.innerHTML;
  }
});
