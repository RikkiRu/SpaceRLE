enum ImageType
{
    None,
    StationSmall,
    StationBig,
}

class ImageLoader
{
    images: Map<ImageType, IMGData>;

    Init()
    {
        this.images = new Map();
        return this;
    }

    Add(key: ImageType, path: string)
    {
        let data = new IMGData();
        data.path = path;
        this.images.set(key, data);
    }

    Load(oncomplete: () => any)
    {
        let imgCounter = 0;
        let total = this.images.size;

        if (total === 0)
            oncomplete();

        for (let item in ImageType)
        {
            if (isNaN(Number(item)))
            {
                let a = <ImageType><any>ImageType[item]
                if (a == ImageType.None)
                    continue;

                let data = this.images.get(a);

                data.raw = new Image();
                data.raw.onload = function()
                {
                    imgCounter++;
                    if (imgCounter === total)
                        oncomplete();
                };

                data.raw.src = data.path;
            }
        }

        return this;
    }
}

class IMGData
{
    path: string;
    raw: HTMLImageElement;
}