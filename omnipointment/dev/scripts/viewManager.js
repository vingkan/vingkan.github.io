export default function (elId) {
    return {
        showView(view) {
            if (this.currentView){
              this.currentView.close();
            }

            this.currentView = view;
            this.currentView.render();

            $(`#${elId}`).html(this.currentView.el);
        }
    };
};
