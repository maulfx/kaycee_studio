from pathlib import Path

ROOT = Path(__file__).parents[1]


def test_editor_dashboard_is_registered():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    js = (ROOT / 'src/js/main.js').read_text(encoding='utf-8')
    assert 'data-tab="editorDesk"' in html
    assert 'id="editorDeskView"' in html
    assert "currentTab = 'editorDesk'" in js


def test_editor_dashboard_has_editor_workflow_sections():
    js = (ROOT / 'src/js/editorDashboard.js').read_text(encoding='utf-8')
    for label in ['PRODUCTION BOARD', 'TODAY\'S FOCUS', 'DELIVERY CHECKLIST', 'QUICK ACTIONS']:
        assert label in js


def test_editor_dashboard_is_styled():
    css = (ROOT / 'src/css/editorDashboard.css').read_text(encoding='utf-8')
    assert '.editor-dashboard' in css
    assert '.queue-list' in css


if __name__ == '__main__':
    for name, fn in list(globals().items()):
        if name.startswith('test_'):
            fn()
            print(name, 'PASS')
    print('all editor dashboard contract checks passed')
