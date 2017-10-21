class ImageLoader
{
    images: IMGData[];

    Init(paths: string[], oncomplete: () => any)
    {
        this.images = [];

        let imgCounter = 0;
        let total = paths.length;

        if (total === 0)
            oncomplete();

        for (let i in paths)
        {
            let data = new IMGData();
            data.path = paths[i];
            data.raw = new Image();
            data.raw.onload = function()
            {
                imgCounter++;
                if (imgCounter === total)
                    oncomplete();
            };

            this.images.push(data);
            data.raw.src = data.path;
        }

        return this;
    }
}

class IMGData
{
    path: string;
    raw: HTMLImageElement;
}