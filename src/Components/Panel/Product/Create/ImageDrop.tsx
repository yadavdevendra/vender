/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect, Component } from "react";
import { DI, DIProps } from "../../../../Core";
import {
  Card,
  Toast,
  Button,
  FlexLayout,
  Select,
  Modal,
  TextField,
} from "@cedcommerce/ounce-ui";
import AddProducts from "./AddProducts";

//interface PropsI extends DIProps {};
interface props extends DIProps {
  imagetoAddProduct: any;
  mediaFileAddProduct: any;
  mediaImageAddProduct: any;
  imgUpdate: any;
  SaveEditDisable:boolean,
}
function ImageDrop(Props: props): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [mediaFile, setmediaFile] = useState<any>([]);
  const [mediaImageFile, setmediaImageFile] = useState<any>([]);

  const [setMedia, setChangeMedia] = useState("");
  const [ImgFrmUrl, setImgFrmUrl] = useState("");
  const [VidFrmUrl, setVidFrmUrl] = useState("");

  const [ModalImage, setModalImage] = useState(false);
  const [ModalVideo, setModalVideo] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  // const [imgLink, setimgLink] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState("");
  const [FileName, setFileName] = useState("");
  const [ImageToast, setImageToast] = useState(false);
  const ImageRef = useRef<any>(null);
  // create a preview as a side effect, whenever selected file is changed

  const ChangeHandler = (event: any) => {
    Object.keys(event.target.files).map((ele) => {
      if (event.target.files[ele]) {
        const files = event.target.files[ele];
        if (
          files.type == "image/png" ||
          files.type == "image/jpeg" ||
          files.type == "image/jpg" ||
          files.type == "image/gif" ||
          files.type == "video/mp4" ||
          files.type == "video/quicktime"
        ) {
          setSelectedFile((prev: any) => [...prev, files]);
          setIsSelected(true);
        } else {
          ImageRef.current.value = "";
          setImageToast(true);
          setFileName(files.name);
        }
      }
    });
  };
  function handleCloseImage() {
    setModalImage(!ModalImage);
  }
  function handleCloseVideo() {
    setModalVideo(!ModalVideo);
  }

  useEffect(() => {
    Props.imagetoAddProduct(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (Props.imgUpdate) {
      ImageRef && ImageRef.current && (ImageRef.current.value = "");
      setSelectedFile([]);
    }
  }, [Props.imgUpdate]);

  useEffect(() => {
    Props.mediaFileAddProduct(mediaFile);
  }, [mediaFile]);

  useEffect(() => {
    Props.mediaImageAddProduct(mediaImageFile);
  }, [mediaImageFile]);

  function CallAddProduct() {
    return (
      <AddProducts
        files={selectedFile}
        media={mediaFile}
        mediaImage={mediaImageFile}
      />
    );
  }

  function onChange1(params: any) {
    setIsSelected(true);
    setmediaFile((prev: any) => [...prev, params]);
  }

  function onChange2(params: any) {
    setIsSelected(true);
    setmediaImageFile((prev: any) => [...prev, params]);
    setImgFrmUrl("");
  }

  function youtube_parser(url: string) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  return (
    <>
      <ToastWrapper>
        {ImageToast && (
          <Toast
            message={`${FileName} is not supported. Only file ending with .jpeg, .jpg, .png, .mov, .glb, .mp4.`}
            type="error"
            timeout={3000}
            onDismiss={() => setImageToast(!ImageToast)}
          />
        )}
      </ToastWrapper>
      <Card
        cardType="plain"
        title="Media"
        extraClass="mt-15"
        action={
          <Select
            name="Add media from URL"
            options={[
              { label: "Add image", value: "1" },
              { label: "Embed video", value: "2" },
            ]}
            type="secondary"
            thickness="thin"
            value={setMedia}
            onChange={(e) => {
              setChangeMedia(e);
              if (e == "1") {
                setModalImage(true);
              } else {
                setModalVideo(true);
              }
            }}
          />
        }
      >
        <FlexLayout spacing="loose" direction="vertical">
          <Card extraClass="mb-20" cardType="plain">
            <div className="image_upload">
              <label className="inte-btn inte-btn--Outlined inte-btn--hasIcon">
                <span className="inte-btn__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </span>
                <span className="inte__text">Upload File</span>
              </label>
              <input className="img_inpt"
                // style={{ width: "203px" }}
                type="file"
                width={"auto"}
                ref={ImageRef}
                multiple
                accept="image/*"
                onChange={ChangeHandler}
              />
            </div>
          </Card>
          {isSelected ? (
            <FlexLayout
              wrap="wrap"
              halign="start"
              valign="start"
              spacing="loose"
            >
              {/* Not coming */}
              {mediaImageFile.length > 0 &&
                mediaImageFile.map((e: any, i: number) => {
                  return (
                    <div key={i}>
                      <Card extraClass="Btn-overImage" cardType="plain">
                        <Button
                          iconRound={false}
                          thickness="thin"
                          type="Plain"
                          onClick={() => {
                            // selectedFile.splice(i, 1);
                            const c = mediaImageFile.filter(
                              (e: string, k: number) => k != i
                            );
                            setmediaImageFile(c);
                            CallAddProduct();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            width="18"
                          >
                            <path
                              d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                              fill="#5C5F62"
                            />
                          </svg>
                        </Button>
                        <div className="Image-Btn">
                          <img
                            src={
                              typeof e == "object" ? URL.createObjectURL(e) : e
                            }
                            width="90px"
                            height="90px "
                            alt="Image Uploaded1"
                          />
                        </div>
                      </Card>
                    </div>
                  );
                })}
              {mediaFile.length > 0 &&
                mediaFile.map((e: any, i: number) => {
                  if (e.includes("www.youtube.com") || e.includes("youtu.be")) {
                    return (
                      <div key={i}>
                        <Card cardType="plain">
                          <FlexLayout spacing="loose" halign="center">
                            <div className="Btn-overVideo Btn-overImage">
                              <Button
                                // icon={cross}
                                iconRound={true}
                                thickness="thin"
                                type="Plain"
                                onClick={() => {
                                  // selectedFile.splice(i, 1);
                                  const c = mediaFile.filter(
                                    (e: string, k: number) => k != i
                                  );

                                  setmediaFile(c);
                                  CallAddProduct();
                                }}
                              >
                                {
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    width="18"
                                  >
                                    <path
                                      d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                      fill="#413bbc"
                                    />
                                  </svg>
                                }
                              </Button>
                              <div className="Image-Video">
                                <iframe
                                  width="250"
                                  src={`https://www.youtube.com/embed/${youtube_parser(
                                    e
                                  )}`}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="autoplay; encrypted-media"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>

                            {/* <TextStyles>{selectedFile[i].name}</TextStyles> */}
                          </FlexLayout>
                        </Card>
                      </div>
                    );
                  }
                })}
              {selectedFile.length > 0 &&
                selectedFile.map((e: any, i: number) => {
                  if (typeof e != "object") {
                    if (e.includes("https://www.youtube.com")) {
                      return (
                        <div key={i}>
                          <Card extraClass="Btn-overImage" cardType="plain">
                            <Button
                              // icon={cross}
                              iconRound={false}
                              thickness="thin"
                              type="Plain"
                              onClick={() => {
                                // selectedFile.splice(i, 1);
                                const c = selectedFile.filter(
                                  (e: string, k: number) => k != i
                                );

                                setSelectedFile(c);
                                CallAddProduct();
                              }}
                            >
                              {
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  width="18"
                                >
                                  <path
                                    d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                    fill="#413bbc"
                                  />
                                </svg>
                              }
                            </Button>
                            <div className="Image-Btn">
                              <iframe
                                width="250px"
                                src={`https://www.youtube.com/embed/${e.slice(
                                  32
                                )}`}
                                allowFullScreen
                              ></iframe>
                            </div>
                          </Card>
                        </div>
                      );
                    } else {
                      return (
                        <div key={i}>
                          <Card extraClass="Btn-overImage" cardType="plain">
                            <Button
                              // icon={cross}
                              iconRound={false}
                              thickness="thin"
                              type="Plain"
                              onClick={() => {
                                // selectedFile.splice(i, 1);
                                const c = selectedFile.filter(
                                  (e: string, k: number) => k != i
                                );
                                setSelectedFile(c);
                                CallAddProduct();
                              }}
                            >
                              {
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  width="18"
                                >
                                  <path
                                    d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                    fill="#413bbc"
                                  />
                                </svg>
                              }
                            </Button>
                            <div className="Image-Btn">
                              <img
                                src={
                                  typeof e == "object"
                                    ? URL.createObjectURL(e)
                                    : e
                                }
                                width="90px"
                                height="90px"
                                alt="Image Uploaded2"
                              />
                            </div>
                          </Card>
                        </div>
                      );
                    }
                  } else if (
                    e.type == "image/png" ||
                    e.type == "image/jpeg" ||
                    e.type == "image/jpg" ||
                    e.type == "image/gif"
                  ) {
                    return (
                      <div key={i}>
                        <Card extraClass="Btn-overImage" cardType="plain">
                          <Button
                            iconRound={false}
                            thickness="thin"
                            type="Plain"
                            onClick={() => {
                              // selectedFile.splice(i, 1);
                              const c = selectedFile.filter(
                                (e: string, k: number) => k != i
                              );
                              ImageRef.current.value = "";

                              setSelectedFile(c);
                              CallAddProduct();
                            }}
                          >
                            {
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                width="18"
                              >
                                <path
                                  d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                  fill="#413bbc"
                                />
                              </svg>
                            }
                          </Button>
                          <div className="Image-Btn">
                            <img
                              title={e.name}
                              src={
                                typeof e == "object"
                                  ? URL.createObjectURL(e)
                                  : e
                              }
                              width="90px"
                              height="90px"
                              alt="Image Uploaded3"
                            />
                          </div>
                        </Card>
                      </div>
                    );
                  } else if (
                    e.type == "video/mp4" ||
                    e.type == "video/quicktime"
                  ) {
                    return (
                      <div key={i}>
                        <Card
                          extraClass="Btn-overVideo Btn-overImage"
                          cardType="plain"
                        >
                          <Button
                            iconRound={true}
                            thickness="thin"
                            type="Plain"
                            onClick={() => {
                              // selectedFile.splice(i, 1);
                              const c = selectedFile.filter(
                                (e: string, k: number) => k != i
                              );
                              ImageRef.current.value = "";

                              setSelectedFile(c);
                              CallAddProduct();
                            }}
                          >
                            {
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                width="18"
                              >
                                <path
                                  d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                  fill="#413bbc"
                                />
                              </svg>
                            }
                          </Button>
                          <div className="Image-Video">
                            <video
                              id="sampleMovie"
                              width="250px"
                              controls
                              src={
                                typeof e == "object"
                                  ? URL.createObjectURL(e)
                                  : e
                              }
                            >
                              {" "}
                            </video>
                          </div>
                        </Card>
                      </div>
                    );
                  }
                })}
            </FlexLayout>
          ) : null}
        </FlexLayout>
        <Modal
          modalSize="small"
          close={handleCloseImage}
          open={ModalImage}
          heading="Add Image from URL"
        >
          <FlexLayout direction="vertical" spacing="loose">
            <TextField
              name="Paste image URL"
              value={ImgFrmUrl}
              type="text"
              thickness="thin"
              placeHolder="https://"
              onChange={(e) => setImgFrmUrl(e)}
            />
            <Button
              disable={ImgFrmUrl == "" ? true : false}
              thickness="thin"
              type="Primary"
              onClick={() => {
                // setimgLink(ImgFrmUrl);
                onChange2(ImgFrmUrl);
                handleCloseImage();
              }}
            >
              Add
            </Button>
          </FlexLayout>
        </Modal>
        <Modal
          modalSize="small"
          close={handleCloseVideo}
          open={ModalVideo}
          heading="Embed video "
        >
          <FlexLayout direction="vertical" spacing="loose">
            <TextField
              name="YouTube or Video URL"
              value={VidFrmUrl}
              onChange={(e) => {
                setVidFrmUrl(e);
              }}
              type="text"
              thickness="thin"
              placeHolder="https://"
            />
            <Button
              disable={VidFrmUrl == "" ? true : false}
              thickness="thin"
              type="Small"
              onClick={() => {
                onChange1(VidFrmUrl);
                setVidFrmUrl("");
                handleCloseVideo();
              }}
            >
              Add
            </Button>
          </FlexLayout>
        </Modal>
      </Card>
    </>
  );
}
interface ToastWrapperI {
  children: React.ReactNode;
}
class ToastWrapper extends Component<ToastWrapperI> {
  constructor(props: ToastWrapperI) {
    super(props);

    this.state = {};
  }

  render() {
    // const children = React.Children.toArray(this.props.children);
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}

export default DI(ImageDrop);
