class ImageLoader
{
    images: Map<string, IMGData>;

    Init()
    {
        this.images = new Map();
        return this;
    }

    Get(key: ImageType)
    {
        return this.images.get(ImageType[key]);
    }

    AddMany(name: string, path: string, count: number)
    {
        for(let i=0; i<count; i++)
        {
            let data = new IMGData();
            data.path = path + name + i + ".png";
            this.images.set(name + i, data);
        }
    }

    Add(key: ImageType, path: string)
    {
        let data = new IMGData();
        data.path = path;
        this.images.set(ImageType[key], data);
    }

    Load(oncomplete: () => any)
    {
        let imgCounter = 0;
        let total = this.images.size;

        if (total === 0)
            oncomplete();

        this.images.forEach((data: IMGData, key: string) =>
        {
            data.raw = new Image();
            data.raw.onload = function()
            {
                imgCounter++;
                if (imgCounter === total)
                    oncomplete();
            };

            data.raw.src = data.path;
        });

        return this;
    }
}

class IMGData
{
    path: string;
    raw: HTMLImageElement;
}