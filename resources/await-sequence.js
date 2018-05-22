async function load() {
    prepareThings();

    await mkdir('dir1');
    await mkdir('dir2');

    handleThings();
}
